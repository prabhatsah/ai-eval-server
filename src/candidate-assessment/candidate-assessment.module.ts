import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CandidateAssessmentController } from './controllers/candidate-assessment.controller';
import { CandidateAssessmentService } from './services/candidate-assessment.service';

@Module({
  imports: [PrismaModule],
  controllers: [CandidateAssessmentController],
  providers: [CandidateAssessmentService],
})
export class CandidateAssessmentModule {}
