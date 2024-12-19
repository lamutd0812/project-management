import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { snakeCaseToCamelCase, success } from '@common/utils/common';

export interface Response<T> {
  data: T;
  statusCode: number;
  logout?: boolean;
  message?: string;
  timestamp?: number;
  meta?: object;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Observable<Response<T>>
    return next.handle().pipe(
      map((payload) => {
        const statusCodeResponse = context
          .switchToHttp()
          .getResponse().statusCode;

        switch (typeof payload) {
          case 'object':
            const { data, meta, ...output } = payload;
            if (output && output.socket) {
              return payload;
            }
            let resultData = data || output;
            if (payload.constructor === Array) {
              resultData = payload;
            }
            if (meta) {
              resultData = { meta, data: resultData };
            }

            Object.keys(resultData).forEach(
              (key) => !resultData[key] && delete resultData[key],
            );
            return snakeCaseToCamelCase(resultData);

          case 'undefined':
            return success({ statusCode: statusCodeResponse });
          default:
            return payload;
        }
      }),
    );
  }
}
