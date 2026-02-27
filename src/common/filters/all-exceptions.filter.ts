import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getHttpStatus(exception);
    const message = this.getErrorMessage(exception);

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: this.isProduction() ? this.getProductionMessage(status) : message,
      ...(this.isDevelopment() && { error: this.getErrorDetails(exception) }),
    };

    // Log error details
    const logMessage = `${request.method} ${request.url} - Status: ${status} - Message: ${message}`;
    
    if (status >= 500) {
      this.logger.error(logMessage, exception);
    } else {
      this.logger.warn(logMessage);
    }

    response.status(status).json(errorResponse);
  }

  private getHttpStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (typeof response === 'object' && response !== null) {
        return (response as any).message || 'Unknown error';
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }

  private getErrorDetails(exception: unknown): any {
    if (exception instanceof Error) {
      return {
        name: exception.name,
        stack: exception.stack,
      };
    }
    return exception;
  }

  private getProductionMessage(status: number): string {
    switch (true) {
      case status >= 500:
        return 'Internal server error';
      case status >= 400:
        return 'Bad request';
      default:
        return 'An error occurred';
    }
  }

  private isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  private isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }
}