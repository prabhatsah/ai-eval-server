import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CandidateAssessmentController } from './controllers/candidate-assessment.controller';
import { CandidateAssessmentService } from './services/candidate-assessment.service';
import { EvaluationModule } from 'src/evaluation/evaluation.module';

@Module({
  imports: [PrismaModule, EvaluationModule],
  controllers: [CandidateAssessmentController],
  providers: [CandidateAssessmentService],
})
export class CandidateAssessmentModule {}
