import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { AiService } from './ai.service';
import { AssessmentAgent } from './agents/assessment.agent';
import { AiController } from './ai.controller';
import { InterviewAgent } from './agents/interview.agent';
import { GeminiService } from './gemini-ai.service';

@Module({
  providers: [
    OpenAiService,
    AiService,
    AssessmentAgent,
    InterviewAgent,
    GeminiService,
  ],
  controllers: [AiController],
  exports: [OpenAiService, AssessmentAgent],
})
export class AiModule {}
