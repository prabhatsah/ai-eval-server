import { Module } from '@nestjs/common';
import { AiModule } from 'src/ai/ai.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ResumeController } from './resume.controller';
import { ResumeParserAgent } from './agents/resume-parser.agent';
import { ResumeService } from './resume.service';

@Module({
  imports: [AiModule, PrismaModule],
  controllers: [ResumeController],
  providers: [ResumeService, ResumeParserAgent],
})
export class ResumeModule {}
