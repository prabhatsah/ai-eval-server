import { PrismaService } from '../../src/prisma/prisma.service';

export async function cleanDb(prisma: PrismaService) {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "User", "Attempt", "Evaluation", "Response"
    RESTART IDENTITY CASCADE;
  `);
}
