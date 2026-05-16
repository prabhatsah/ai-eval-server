import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JdParserAgent } from './agents/jd-parser.agent';

@Injectable()
export class JdService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jdParserAgent: JdParserAgent,
  ) {}

  async createJd(jdText: string, apiKey: string) {
    // Parse JD
    const parsed = await this.jdParserAgent.parseJD(jdText, apiKey);

    // Versioning logic
    const jdGroupId = crypto.randomUUID();

    const version = 1;

    // Save in DB
    const jd = await this.prisma.jobDescription.create({
      data: {
        jdGroupId,
        version,
        ...parsed,
        rawText: jdText,
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
