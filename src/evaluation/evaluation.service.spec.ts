import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationService } from './evaluation.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EvaluationService', () => {
  let service: EvaluationService;

  const prismaMock = {
    evaluation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(EvaluationService);
  });

  it('should create evaluation', async () => {
    prismaMock.evaluation.create.mockResolvedValue({ id: '1' });

    const result = await service.createEvaluation(
      { title: 'Test', skill: 'JS', config: {} },
      'user1',
    );

    expect(result.id).toBe('1');
    expect(prismaMock.evaluation.create).toHaveBeenCalled();
  });
});
