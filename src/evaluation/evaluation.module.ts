import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {}
