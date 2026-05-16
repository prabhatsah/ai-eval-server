import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Role } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUsers = [
    {
      id: 'uuid-1',
      name: 'Prabhat Kumar',
      email: 'prabhat@example.com',
      role: Role.MANAGER,
      createdAt: new Date(),
    },
  ];

  const mockUserService = {
    getAllUsers: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: get all users
  it('should return all users', async () => {
    mockUserService.getAllUsers.mockResolvedValue(mockUsers);

    const result = await controller.getAllUsers();

    expect(result).toEqual(mockUsers);
    expect(service.getAllUsers).toHaveBeenCalled();
  });

  // Test: get user by id
  it('should return user by id', async () => {
    const user = mockUsers[0];

    mockUserService.findById.mockResolvedValue(user);

    const result = await controller.getUserById({ id: user.id });

    expect(result).toEqual(user);
    expect(service.findById).toHaveBeenCalledWith(user.id);
  });
});
