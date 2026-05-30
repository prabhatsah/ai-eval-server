import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JdParserAgent } from './agents/jd-parser.agent';
import { extractResumeText } from 'src/resume/utils/resume-text-extractor';
import { userIdParamSchema } from 'src/user/validators/user.schema';
import { JwtUser } from 'src/auth/interfaces/jwt-payload.interface';

@Injectable()
export class JdService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jdParserAgent: JdParserAgent,
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
    // Extract text
    const text = await extractResumeText(file);

    // Parse JD
    const parsed = await this.jdParserAgent.parseJD(text, llmProvider, apiKey);

    // Versioning logic
    const jdGroupId = crypto.randomUUID();

    const version = 1;

    // Save in DB
    const jd = await this.prisma.jobDescription.create({
      data: {
        jdGroupId,
        createdById: user.userId,
        version,
        ...parsed,
        rawText: text,
      },
    });

    return jd;
  }

  async getById(id: string, user: JwtUser) {
    return this.prisma.jobDescription.findUnique({
      where: { id, createdById: user.userId },
    });
  }

  async getLatestByGroup(jdGroupId: string) {
    return this.prisma.jobDescription.findFirst({
      where: {
        jdGroupId,
        isLatest: true,
      },
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
