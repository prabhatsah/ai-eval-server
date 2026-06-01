import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { extractTextFromFile } from 'src/resume/utils/resume-text-extractor';
import { JwtUser } from 'src/auth/interfaces/jwt-payload.interface';
import { JdProcessingWorkflow } from './workflows/jd-processing.workflow';

@Injectable()
export class JdService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jdWorkflow: JdProcessingWorkflow,
  ) {}

  async parseJd(
    file: Express.Multer.File,
    user: JwtUser,
    llmProvider: string,
    apiKey: string,
  ) {
    if (!user.userId) {
      throw new BadRequestException('User not authenticated');
    }

    if (!llmProvider) {
      throw new BadRequestException('LLM provider is missing');
    }

    if (!apiKey) {
      throw new BadRequestException('API key is missing');
    }

    const rawText = await extractTextFromFile(file);

    const workflowResult = await this.jdWorkflow.execute(
      rawText,
      llmProvider,
      apiKey,
    );

    const jdGroupId = crypto.randomUUID();

    const version = 1;

    const jd = await this.prisma.jobDescription.create({
      data: {
        jdGroupId,
        createdById: user.userId,
        version,
        rawText,

        ...workflowResult.parsed,
      },
    });

    return {
      jd,
      workflow: {
        critique: workflowResult.critique,
        attempts: workflowResult.totalAttempts,
      },
    };
  }

  async getById(id: string, user: JwtUser) {
    return this.prisma.jobDescription.findUnique({
      where: { id, createdById: user.userId },
    });
  }

  async getAll(user: JwtUser) {
    return this.prisma.jobDescription.findMany({
      where: { createdById: user.userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
