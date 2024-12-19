import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

import * as i18n from 'i18n';
import { validateDatatype } from '@common/utils/common';
import { DATA_TYPE } from '@common/enums/common.enum';
import { SYSTEM_ERROR } from '@common/constants/error-messages';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  async catch(exception: any, host: ArgumentsHost) {
    //HttpException
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { body } = request;
    const { query, method, url } = request;
    const response = <any>ctx.getResponse<Response>();
    const ignoreRoute = ['/api/v1/auth/login'];

    const requestInfo = {
      method,
      url,
      body,
      query,
      ip: (request.headers['x-forwarded-for'] || request.ip || '')
        .toString()
        .replace('::ffff:', ''),
    };
    if (ignoreRoute.includes(url)) requestInfo.body = {};

    if (exception?.stack)
      exception.stack = exception.stack.split('\n    at ')[1] || '';

    const status = this.getStatusCode(exception);
    const { message, logTag } = this.getMessageError(exception);
    const logData = {
      tag: logTag,
      url: url,
      exception: exception || '',
      request: requestInfo,
    };
    const responseData = {
      reason: exception?.response?.reason,
      message: message,
      statusCode: status,
    };

    this.standardizeLogger(logData);
    return response.status(status).json(responseData);
  }
  getStatusCode(exception) {
    return exception instanceof HttpException
      ? exception.getStatus()
      : exception?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  }
  getMessageErrorHttpException(exception: HttpException) {
    const exceptionObject: any = exception.getResponse();
    let message = validateDatatype(exceptionObject.message, DATA_TYPE.STRING)
      ? exceptionObject.message
      : exceptionObject.message[0];

    if (!exceptionObject.validation) message = i18n.__(message); //(1)
    return message;
  }
  getMessageError(exception: any) {
    let logTag = 'NORMAL';
    let message = SYSTEM_ERROR;
    try {
      console.log(exception.stack);
      if (exception instanceof HttpException) {
        logTag = 'HttpException';
        message = this.getMessageErrorHttpException(exception);
      } else if (exception instanceof Error) {
        logTag = 'Error';
        message = exception.message; //(1)
      } else {
        if (validateDatatype(exception, DATA_TYPE.OBJECT)) {
          message = exception.message || message;
          if (!exception.validation) message = i18n.__(message); //(1)
        } else {
          message = i18n.__(exception || message); //(1)
        }
      }
    } catch (error) {
      console.log('error');
    }
    return { message, logTag };
  }
  standardizeLogger(logData) {
    this.logger.error(
      JSON.stringify({
        type: logData.tag,
        date: new Date(),
        exception: logData.exception.stack,
        message: logData.exception.message,
        apiPath: logData.url,
        request: logData.request,
      }),
    );
  }
}
