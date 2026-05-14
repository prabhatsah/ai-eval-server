import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AssessmentAgent } from './agents/assessment.agent';
import { AiController } from './ai.controller';
import { GeminiService } from './gemini-ai.service';

@Module({
  providers: [AiService, AssessmentAgent, GeminiService],
  controllers: [AiController],
  exports: [AssessmentAgent],
})
export class AiModule {}
