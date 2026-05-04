import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import {
  EvaluationConfigSchema,
  EvaluationSchema,
} from './validators/evaluation.schema';
import { z } from 'zod';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  async createEvaluation(dto: CreateEvaluationDto, userId: string) {
    const config = EvaluationConfigSchema.parse({
      sections: dto.sections,
      passingScore: dto.passingScore,
    });

    return this.prisma.evaluation.create({
      data: {
        title: dto.title,
        skill: dto.skill,
        config,
        createdBy: userId,
      },
    });
  }

  async getAllEvaluations() {
    const evaluations = await this.prisma.evaluation.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (evaluations.length == 0) return null;

    return z.array(EvaluationSchema).parse(evaluations);
  }

  async getEvaluationById(id: string) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
    });

    if (!evaluation) return null;

    return EvaluationSchema.parse(evaluation);
  }
}
