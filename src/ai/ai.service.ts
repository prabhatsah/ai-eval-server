import {
  GatewayTimeoutException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { mapHttpError } from './mapper/httpError.mapper';
import { extractProviderError } from './mapper/providerError.mapper';

@Injectable()
export class AiService {
  private readonly BASE_URL = 'https://ai-proxy-lxs4.onrender.com/ask';
  private readonly TIMEOUT = 105000; // 15s

  async generate(
    prompt: string,
    llmProvider: string,
    apiKey: string,
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.TIMEOUT);

    try {
      const res = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          provider: llmProvider,
          prompt,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const rawText = await res.text();

      // parsing JSON safely
      let data: any;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        throw new InternalServerErrorException({
          message: 'AI provider returned invalid JSON response',
        });
      }

      // Handle provider errors
      if (!res.ok) {
        const providerMessage = extractProviderError(
          data,
          'AI provider request failed',
        );

        mapHttpError(res.status, providerMessage);
      }

      // Validate success response
      if (!data || typeof data.response !== 'string' || !data.response.trim()) {
        throw new InternalServerErrorException({
          message: 'Invalid AI response format',
        });
      }

      console.log('[AI RESPONSE]', {
        length: data.response.length,
      });

      return data.response;
    } catch (error: any) {
      clearTimeout(timeout);

      // Request timeout
      if (error.name === 'AbortError') {
        throw new GatewayTimeoutException({
          message: 'AI request timed out',
        });
      }

      // Already handled NestJS exceptions
      if (error instanceof HttpException) {
        throw error;
      }

      // console.error('[AI ERROR]', error);

      throw new InternalServerErrorException({
        message: 'Failed to communicate with AI provider',
        details: error?.message || 'Unknown error',
      });
    }
  }
}
