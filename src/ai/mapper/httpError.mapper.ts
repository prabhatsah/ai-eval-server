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

/* =========================
     Error Mapper 
  ========================= */

export const mapHttpError = (status: number, message: any): never => {
  switch (status) {
    case 400:
      throw new BadGatewayException({
        message: 'Invalid AI request',
        details: message,
      });

    case 401:
      throw new UnauthorizedException({
        message: 'Invalid API key',
        details: message,
      });

    case 403:
      throw new ForbiddenException({
        message: 'Access forbidden',
        details: message,
      });

    case 404:
      throw new BadGatewayException({
        message: 'AI endpoint not found',
        details: message,
      });

    case 429:
      throw new HttpException(
        {
          message: 'Rate limit exceeded',
          details: message,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );

    case 500:
      throw new InternalServerErrorException({
        message: 'AI internal error',
        details: message,
      });

    case 503:
      throw new ServiceUnavailableException({
        message: 'AI service unavailable',
        details: message,
      });

    case 504:
      throw new GatewayTimeoutException({
        message: 'AI gateway timeout',
        details: message,
      });

    default:
      throw new InternalServerErrorException({
        message: 'Unknown AI error',
        details: message,
      });
  }
};
