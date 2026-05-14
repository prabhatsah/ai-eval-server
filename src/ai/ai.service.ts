import {
  GatewayTimeoutException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { mapHttpError } from './mapper/httpError.mapper';

@Injectable()
export class AiService {
  private readonly BASE_URL = 'https://ai-proxy-lxs4.onrender.com/ask';
  private readonly TIMEOUT = 15000; // 15s

  async generate(prompt: string, apiKey: string): Promise<string> {
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
          provider: 'openai',
          prompt,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const text = await res.text();

      // parsing JSON safely
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response: ${text}`);
      }

      // Handle HTTP errors properly
      if (!res.ok) {
        mapHttpError(res.status, data?.error || text);
      }

      // Validate response structure
      if (!data?.response || typeof data.response !== 'string') {
        throw new InternalServerErrorException({
          message: 'Invalid AI response format',
          details: data,
        });
      }

      console.log('[AI RESPONSE]', {
        length: data.response.length,
      });

      return data.response;
    } catch (error: any) {
      clearTimeout(timeout);

      //  Abort (timeout)
      if (error.name === 'AbortError') {
        throw new GatewayTimeoutException({
          message: 'AI request timed out',
        });
      }

      // Already mapped NestJS error
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('[AI ERROR]', error);

      throw new InternalServerErrorException({
        message: 'Failed to call AI service',
        details: error.message,
      });
    }
  }
}
