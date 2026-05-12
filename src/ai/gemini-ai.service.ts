import {
  BadGatewayException,
  ForbiddenException,
  GatewayTimeoutException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;

  // constructor() {
  //   this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  // }

  async generate(prompt: string, apiKey: string): Promise<string> {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const result = await model.generateContent(prompt);

      const response = result.response;

      return response.text();
    } catch (error: any) {
      console.log('error:', error);

      const status = error?.status || error?.response?.status;

      const message = error?.message || 'Gemini API Error';

      switch (status) {
        case 400:
          throw new BadGatewayException({
            message: 'Invalid Gemini request',
            details: message,
          });

        case 401:
          throw new UnauthorizedException({
            message: 'Invalid Gemini API key',
            details: message,
          });

        case 403:
          throw new ForbiddenException({
            message: 'Gemini access forbidden',
            details: message,
          });

        case 404:
          throw new BadGatewayException({
            message: 'Gemini model not found',
            details: message,
          });

        case 429:
          throw new HttpException(
            {
              message: 'Gemini API quota exceeded',
              details: message,
            },
            HttpStatus.TOO_MANY_REQUESTS,
          );

        case 500:
          throw new InternalServerErrorException({
            message: 'Gemini internal server error',
            details: message,
          });

        case 503:
          throw new ServiceUnavailableException({
            message: 'Gemini service unavailable',
            details: message,
          });

        case 504:
          throw new GatewayTimeoutException({
            message: 'Gemini request timeout',
            details: message,
          });

        default:
          throw new InternalServerErrorException({
            message: 'Failed to call Gemini API',
            details: message,
          });
      }
    }
  }
}
