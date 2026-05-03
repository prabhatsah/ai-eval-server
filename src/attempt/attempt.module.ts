import { Module } from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { AttemptController } from './attempt.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AiModule } from 'src/ai/ai.module';
import { AuthModule } from 'src/auth/auth.module';
import { AiService } from 'src/ai/ai.service';
import { ScoringService } from './scoring.service';

@Module({
  imports: [PrismaModule, AiModule, AuthModule],
  providers: [AttemptService, AiService, ScoringService],
  controllers: [AttemptController],
})
export class AttemptModule {}
