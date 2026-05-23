import {
  ForbiddenException,
  GatewayTimeoutException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

export const mapHttpError = (
  status: number,
  providerMessage: string,
): never => {
  switch (status) {
    case 400:
      throw new BadRequestException({
        message: providerMessage,
      });

    case 401:
      throw new UnauthorizedException({
        message: providerMessage,
      });

    case 403:
      throw new ForbiddenException({
        message: providerMessage,
      });

    case 404:
      throw new NotFoundException({
        message: providerMessage,
      });

    case 429:
      throw new HttpException(
        {
          message: providerMessage,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );

    case 500:
      throw new InternalServerErrorException({
        message: providerMessage,
      });

    case 503:
      throw new ServiceUnavailableException({
        message: providerMessage,
      });

    case 504:
      throw new GatewayTimeoutException({
        message: providerMessage,
      });

    default:
      throw new HttpException(
        {
          message: providerMessage || 'Unknown AI error',
        },
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }
};
