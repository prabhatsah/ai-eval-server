import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { AssessmentAgent } from './agents/assessment.agent';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [AssessmentController],
  providers: [AssessmentService, AssessmentAgent],
})
export class AssessmentModule {}
