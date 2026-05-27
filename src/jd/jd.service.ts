import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JdParserAgent } from './agents/jd-parser.agent';
import { extractResumeText } from 'src/resume/utils/resume-text-extractor';

@Injectable()
export class JdService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jdParserAgent: JdParserAgent,
  ) {}

  async parseJd(
    file: Express.Multer.File,
    llmProvider: string,
    apiKey: string,
  ) {
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
        version,
        ...parsed,
        rawText: text,
      },
    });

    return jd;
  }

  async getById(id: string) {
    return this.prisma.jobDescription.findUnique({
      where: { id },
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

  async getAll() {
    return this.prisma.jobDescription.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
