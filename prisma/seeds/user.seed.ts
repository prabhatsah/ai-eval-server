import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding users...');

  const hashedPassword = await bcrypt.hash('Pass@123', 10);

  const users = [
    {
      name: 'Prabhat Kumar',
      email: 'prabhat.kumar@example.com',
      password: hashedPassword,
      role: Role.MANAGER,
    },
    {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
    {
      name: 'Anjali Verma',
      email: 'anjali.verma@example.com',
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
    {
      name: 'Amit Singh',
      email: 'amit.singh@example.com',
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
    {
      name: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
    {
      name: 'Vikram Mehta',
      email: 'vikram.mehta@example.com',
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
    {
      name: 'Pooja Nair',
      email: 'pooja.nair@example.com',
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
    {
      name: 'Karan Patel',
      email: 'karan.patel@example.com',
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
    {
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
    {
      name: 'Rohit Das',
      email: 'rohit.das@example.com',
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
    {
      name: 'Meera Iyer',
      email: 'meera.iyer@example.com',
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
    {
      name: 'Arjun Kapoor',
      email: 'arjun.kapoor@example.com',
      password: hashedPassword,
      role: Role.CANDIDATE,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('Users seeded successfully');
}
