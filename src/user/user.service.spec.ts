import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockUsers = [
    {
      id: 'uuid-1',
      name: 'Prabhat Kumar',
      email: 'prabhat@example.com',
      role: Role.MANAGER,
      createdAt: new Date(),
    },
  ];

  const mockPrisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: get all users
  it('should return all users', async () => {
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);

    const result = await service.getAllUsers();

    expect(result).toEqual(mockUsers);
    expect(prisma.user.findMany).toHaveBeenCalled();
  });

  // Test: get user by id
  it('should return user if found', async () => {
    const user = mockUsers[0];

    mockPrisma.user.findUnique.mockResolvedValue(user);

    const result = await service.findById(user.id);
    console.log('result:', result);

    expect(result).toEqual(user);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: user.id },
    });
  });

  // Test: user not found
  it('should throw NotFoundException if user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(service.findById('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
