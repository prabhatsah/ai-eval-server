import { PrismaClient } from '@prisma/client';
import { seedUsers } from './user.seed';

export async function runSeeds(prisma: PrismaClient) {
  await seedUsers(prisma);

  // Future seeds go here
  // await seedAttempts(prisma)
  // await seedPosts(prisma)
}
