import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    let errors: any = null;
    let details: any = null;

    /**
     * NestJS HTTP Exceptions
     */
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const res: any = exceptionResponse;

        message = res.message || message;

        errors = res.error || null;

        if (Array.isArray(res.message)) {
          errors = res.message;
          message = 'Validation failed';
        }
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      /**
       * Prisma Errors
       */
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Duplicate field value already exists';
          break;

        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;

        default:
          status = HttpStatus.BAD_REQUEST;

          message = exception.message;
      }
    } else if (exception instanceof Error) {
      /**
       * Unknown Errors
       */
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
