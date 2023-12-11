import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  createUser(email: string, password: string) {
    const newUser = this.repo.create({ email, password });
    return this.repo.save(newUser);
  }
  getUserById(id: number) {
    const user = this.repo.findOneBy({ id });
    if(!user) throw new NotFoundException('User not found')
    return user;
  }
  findByEmail(email: string) {
    const matches = this.repo.find({ where: { email: email } });
    console.log(matches)
    if (!matches) throw new NotFoundException('No matches');
    return matches;
  }
  async updateUser(id: number, attrs: Partial<User>) {
    const user: User = await this.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
  async removeUser(id: number) {
    const user: User = await this.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    return this.repo.remove(user);
  }
}
