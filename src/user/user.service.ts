import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, SafeUser } from './types/user.types';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async createUser(data: CreateUserDto): Promise<SafeUser> {
    const user = await this.prisma.user.create({
      data,
    });

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async getAllUsers(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany();

    return users.map(({ password: _password, ...user }) => user);
  }
}
