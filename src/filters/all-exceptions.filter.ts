import { HttpExceptionDto } from '@common/dto/http-exception.dto';
import { DayJS } from '@common/utils/dayjs';
import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { ResponseException } from './exception-response';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: HttpException | ResponseException, host: ArgumentsHost) {
    console.log(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionString = JSON.stringify(exception.getResponse());
      const { message: errMessage } = JSON.parse(exceptionString);
      message = errMessage;
    } else {
      status = exception.status;
      message = exception.message;
    }

    const timestamp = DayJS().utc().format();

    const errorResponse: HttpExceptionDto = {
      method: request.method,
      path: request.url,
      statusCode: status,
      message,
      timestamp,
    };

    return response.status(status).json(errorResponse);
  }
}
