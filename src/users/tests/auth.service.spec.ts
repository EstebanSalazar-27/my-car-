import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: Partial<AuthService>;
  let fakeUserService: Partial<UsersService>;
  const fakePass = 'pastelito';
  const fakeEmail = 'unittesting@gmail.com';
  beforeEach(async () => {
    fakeUserService = {
      findByEmail: () => Promise.resolve([]),
      createUser: (email: string, password: string) =>
        Promise.resolve({ id: 20, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();
    service = module.get(AuthService);
  });
  it('Can create a instance of authService', async () => {
    expect(service).toBeDefined();
  });
  it('Throw a error if the email is in use', async () => {
    fakeUserService.findByEmail = () =>
      Promise.resolve([
        { id: 29, email: fakeEmail, password: fakePass } as User,
      ]);
    await expect(service.signUp(fakeEmail, fakePass)).rejects.toThrow(
      BadRequestException,
    );
  });
  it('Throw a error if  signin is called with a unused email ', async () => {
    await expect(
      service.signIn('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });
  it('Create a new user with a salted and hashed password', async () => {
    const user = await service.signUp(fakeEmail, fakePass);
    expect(user.password).not.toEqual(fakePass);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
});
