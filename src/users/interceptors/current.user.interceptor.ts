import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler<any>) {
    // Get the request json
    const request = context.switchToHttp().getRequest();
    // Get the userId property from session
    const { userId } = request.session || {};
    // Check if there's a user id no falsie
    // Set the currentUser in the request json
    if (userId) {
      const user = await this.usersService.getUserById(userId);
      request.currentUser = user;
    }
    // else handle the route
    return handler.handle();
  }
}
