import { Role } from '@prisma/client';

export interface JwtUser {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

export interface RequestWithUser extends Request {
  user: JwtUser;
}
