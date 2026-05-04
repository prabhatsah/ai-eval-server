import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

import { Response, Attempt } from '@prisma/client';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { ScoringService } from './scoring.service';
import { EvaluationConfigSchema } from '../evaluation/validators/evaluation.schema';
import {
  StartAttemptSchema,
  SubmitAnswerSchema,
} from './validator/attempt.schema';

@Injectable()
export class AttemptService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private scoringService: ScoringService,
  ) {}

  async startAttempt(userId: string, evaluationId: string): Promise<Attempt> {
    const parsed = StartAttemptSchema.parse({ evaluationId });

    return this.prisma.attempt.create({
      data: {
        userId,
        evaluationId: parsed.evaluationId,
        status: 'IN_PROGRESS',
      },
    });
  }

  async submitAnswer(input: SubmitAnswerDto): Promise<Response> {
    const parsed = SubmitAnswerSchema.parse(input);

    const { attemptId, question, answer, type } = parsed;

    let score: number | null = null;
    let feedback: string | null = null;

    if (type === 'AI') {
      const aiResult = await this.aiService.evaluateAnswer(question, answer);

      score = aiResult.score;
      feedback = aiResult.feedback;
    }

    return this.prisma.response.create({
      data: {
        attemptId,
        question,
        answer,
        score,
        feedback,
        type,
      },
    });
  }

  async finalizeAttempt(attemptId: string) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
      include: { evaluation: true },
    });

    if (!attempt) throw new Error('Attempt not found');

    const responses = await this.prisma.response.findMany({
      where: { attemptId },
    });

    const config = EvaluationConfigSchema.parse(attempt.evaluation.config);

    const { finalScore, aiScore } = this.scoringService.calculateScore(
      responses,
      config,
    );

    const status = finalScore >= config.passingScore ? 'PASSED' : 'FAILED';

    return this.prisma.attempt.update({
      where: { id: attemptId },
      data: {
        aiScore,
        finalScore,
        status,
        submittedAt: new Date(),
      },
    });
  }
}
