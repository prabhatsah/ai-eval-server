import { Module } from '@nestjs/common';
import { AiModule } from 'src/ai/ai.module';
import { AssessmentCriticAgent } from './agents/assessment-critic.agent';
import { AssessmentCriticService } from './assessment-critic.service';

@Module({
  imports: [AiModule],
  providers: [AssessmentCriticAgent, AssessmentCriticService],
  exports: [AssessmentCriticAgent, AssessmentCriticService],
})
export class AssessmentCriticModule {}
