import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AssessmentAgent } from './agents/assessment.agent';
import { AiController } from './ai.controller';
import { GeminiService } from './gemini-ai.service';
import { AssessmentOrchestratorService } from './assessment-orchestrator.service';
import { JdParserAgent } from './agents/jd-parser.agent';

@Module({
  providers: [
    AiService,
    AssessmentAgent,
    GeminiService,
    AssessmentOrchestratorService,
    JdParserAgent,
  ],
  controllers: [AiController],
  exports: [AssessmentAgent],
})
export class AiModule {}
