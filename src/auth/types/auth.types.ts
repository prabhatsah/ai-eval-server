import { Role } from '@prisma/client';

export type JwtPayload = {
  userId: string;
  role: Role;
};

export type JwtRefreshVerifyPayload = {
  refreshToken: string;
  secret: string;
};
