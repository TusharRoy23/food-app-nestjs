import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { RESPONSE_MESSAGE } from '../decorator/response-msg.decorator';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<Response<T>> {
    const responseMsg =
      this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) ?? '';
    return next.handle().pipe(
      map((data) => ({
        data,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: responseMsg,
      })),
    );
  }
}
