import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { AssessmentAgent } from './agents/assessment.agent';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiModule } from 'src/ai/ai.module';
import { AssessmentCriticModule } from 'src/assessment-critic/assessment-critic.module';

@Module({
  imports: [PrismaModule, AiModule, AssessmentCriticModule],
  controllers: [AssessmentController],
  providers: [AssessmentService, AssessmentAgent],
})
export class AssessmentModule {}
