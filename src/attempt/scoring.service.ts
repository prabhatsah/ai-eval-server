import { Injectable } from '@nestjs/common';
import { EvaluationConfig } from '../evaluation/validators/evaluation.schema';
import { Response } from '@prisma/client';

@Injectable()
export class ScoringService {
  calculateScore(
    responses: Response[],
    config: EvaluationConfig,
  ): { finalScore: number; aiScore: number } {
    const grouped = {
      AI: [] as number[],
      MCQ: [] as number[],
      CODING: [] as number[],
    };

    responses.forEach((r) => {
      if (r.score !== null) {
        grouped[r.type].push(r.score);
      }
    });

    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const aiScore = avg(grouped.AI);
    const mcqScore = avg(grouped.MCQ);
    const codingScore = avg(grouped.CODING);

    const finalScore =
      aiScore * config.sections.AI.weight * 10 +
      mcqScore * config.sections.MCQ.weight * 10 +
      codingScore * config.sections.CODING.weight * 10;

    return {
      finalScore,
      aiScore,
    };
  }
}
