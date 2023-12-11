import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from '../user.entity';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async signUp(email: string, password: string) {
    // Check if email is in use
    const matches = await this.userService.findByEmail(email);
    // If it's return a error
    if (matches.length) throw new BadRequestException('Email  in use ');
    // Generate a salt
    const salt: string = randomBytes(8).toString('hex');
    // Hash the users password
    // Hash the salt and the password together
    const hash: Buffer = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hashed result and the salt together
    const resultedPassword: string = salt + '.' + hash.toString('hex');
    // Create a new user and save it
    const user = await this.userService.createUser(email, resultedPassword);
    // Return the user
    return user;
  }
  async signIn(email: string, password: string) {
    const [user] = await this.userService.findByEmail(email);
    console.log(user)
    if (!user) throw new NotFoundException('User no exists');
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('Wrong Password');

    return user;
  }
}
