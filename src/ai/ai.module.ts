import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { AiService } from './ai.service';
import { AssessmentAgent } from './agents/assessment.agent';
import { AiController } from './ai.controller';
import { InterviewAgent } from './agents/interview.agent';

@Module({
  providers: [OpenAiService, AiService, AssessmentAgent, InterviewAgent],
  controllers: [AiController],
  exports: [OpenAiService, AssessmentAgent],
})
export class AiModule {}
