import { Role, User } from '@prisma/client';

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export type SafeUser = Omit<User, 'password'>;
