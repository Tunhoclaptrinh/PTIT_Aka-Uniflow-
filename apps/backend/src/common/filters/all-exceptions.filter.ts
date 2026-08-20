import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileLogger } from '../utils/file-logger.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP_ERROR');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as Error)?.message || 'Lỗi máy chủ nội bộ';

    const errorMessage =
      typeof message === 'object' && message !== null && 'message' in message
        ? (message as any).message
        : message;

    const stack = (exception as Error)?.stack;

    // 1. Log ra terminal console
    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Error: ${JSON.stringify(
        errorMessage
      )}`
    );

    // 2. Tự động ghi vào file logs/backend/error.log
    FileLogger.logError('backend', typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage), stack, {
      method: request.method,
      url: request.url,
      statusCode: status,
      body: request.body || {},
      query: request.query || {},
      ip: request.ip,
      headers: {
        userAgent: request.headers['user-agent'],
        tenantId: request.headers['x-tenant-id'],
      },
    });

    response.status(status).json({
      success: false,
      statusCode: status,
      path: request.url,
      method: request.method,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
