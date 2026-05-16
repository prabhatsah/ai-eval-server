import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  // Mock UserService
  const mockUserService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  // Mock Prisma
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  // Mock JWT
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,

        {
          provide: UserService,
          useValue: mockUserService,
        },

        {
          provide: PrismaService,
          useValue: mockPrisma,
        },

        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // SIGNUP TEST
  it('should signup user successfully', async () => {
    mockUserService.findByEmail.mockResolvedValue(null);
    mockUserService.createUser.mockResolvedValue({});

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);

    const dto = {
      name: 'Prabhat',
      email: 'test@example.com',
      password: 'Pass@123',
    };

    const result = await service.signup(dto as any);

    expect(result).toEqual({ message: 'User created' });
    expect(mockUserService.createUser).toHaveBeenCalled();
  });

  // signup duplicate user
  it('should throw if user already exists', async () => {
    mockUserService.findByEmail.mockResolvedValue({ id: '1' });

    await expect(
      service.signup({
        email: 'test@example.com',
      } as any),
    ).rejects.toThrow('User already exists');
  });

  // LOGIN SUCCESS
  it('should login successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashed-password',
      role: Role.CANDIDATE,
    };

    mockUserService.findByEmail.mockResolvedValue(mockUser);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    mockJwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    mockPrisma.user.update.mockResolvedValue({});

    const result = await service.login({
      email: 'test@example.com',
      password: 'Pass@123',
    });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
  });

  // LOGIN - wrong email
  it('should throw if user not found', async () => {
    mockUserService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'wrong@example.com',
        password: 'Pass@123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  // LOGIN - wrong password
  it('should throw if password invalid', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashed-password',
      role: Role.CANDIDATE,
    };

    mockUserService.findByEmail.mockResolvedValue(mockUser);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(
      service.login({
        email: 'test@example.com',
        password: 'wrong',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
