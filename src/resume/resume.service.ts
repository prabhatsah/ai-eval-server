import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResumeParserAgent } from './agents/resume-parser.agent';
import { extractResumeText } from './utils/resume-text-extractor';

@Injectable()
export class ResumeService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly resumeParserAgent: ResumeParserAgent,
  ) {}

  async uploadResume(
    file: Express.Multer.File,
    userId: string,
    llmProvider: string,
    apiKey: string,
  ) {
    const text = await extractResumeText(file);

    // ai parse
    const parsed = await this.resumeParserAgent.parseResume(
      text,
      llmProvider,
      apiKey,
    );

    // update user
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        skills: parsed.skills,
        currentRole: parsed.currentRole,
        experienceYears: parsed.experienceYears,
      },
    });

    return updatedUser;
  }
}
