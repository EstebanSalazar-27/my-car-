import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

it('Can create a instance of authService', async () => {
  const fakeUserService: Partial<UsersService> = {
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
  const service = module.get(UsersService);
  expect(service).toBeDefined();
});
