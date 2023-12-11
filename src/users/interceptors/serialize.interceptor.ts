import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { UserDto } from '../dtos/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  constructor(public DTO: any) {}
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> {
    // Run code before the request is handled
    console.log('Running before handle', context.getClass());

    return handler.handle().pipe(
      map((data: any) => {
        console.log(' Run code before sent out the data', data);
        return data
      }),
    );
  }
}
