import { Test, TestingModule } from '@nestjs/testing';
import { AttemptService } from './attempt.service';

describe('AttemptService', () => {
  let service: AttemptService;

  const aiMock = {
    evaluateAnswer: jest.fn().mockResolvedValue({
      score: 8,
      feedback: 'Good',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttemptService],
    }).compile();

    service = module.get<AttemptService>(AttemptService);
  });

  it('should evaluate AI answer', async () => {
    await service.submitAnswer({
      attemptId: '1',
      question: 'What is React?',
      answer: 'Library',
      type: 'AI',
    });

    expect(aiMock.evaluateAnswer).toHaveBeenCalled();
  });
});
