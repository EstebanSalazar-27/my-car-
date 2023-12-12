import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from './decorators/serialize';
import { AuthService } from './auth/auth.service';
import { CurrentUser } from './decorators/current.user.decorator';
import { CurrentUserInterceptor } from './interceptors/current.user.interceptor';
import { User } from './user.entity';
import { NotFoundError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';

@Controller('users')
@Serialize<UserDto>(new UserDto())
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  // UseInterceptor and class serializer to exclude the password field at the time to return the user entity as json
  @Post('/auth/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signUp(email, password);
    session.userId = user.id;
    return user;
  }
  @Post('/auth/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signIn(email, password);
    session.userId = user.id;
    return user;
  }
  @Get('/auth/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }
  @Patch('/update/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(parseInt(id), body);
  }
  @Get('/currentUser')
  @UseGuards(AuthGuard)
  getCurrentSignedUser(@CurrentUser() user: User) {
    if (!user) throw new BadRequestException('No user signed in');
    return user;
  }
  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(parseInt(id));
  }
  @Get()
  findByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }
  @Delete('/remove/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.removeUser(parseInt(id));
  }
}
