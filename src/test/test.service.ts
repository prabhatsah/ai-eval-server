import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  async testDb() {
    return this.prisma.user.findMany();
  }
}
