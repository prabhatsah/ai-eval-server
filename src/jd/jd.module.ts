import { Module } from '@nestjs/common';
import { JdController } from './jd.controller';
import { JdService } from './jd.service';
import { AiModule } from 'src/ai/ai.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JdCritiqueAgent } from './agents/jd-critique.agent';
import { JdProcessingWorkflow } from './workflows/jd-processing.workflow';
import { JdParserAgent } from './agents/jd-parser.agent';

@Module({
  imports: [AiModule, PrismaModule, AuthModule, JwtModule],
  controllers: [JdController],
  providers: [JdService, JdParserAgent, JdCritiqueAgent, JdProcessingWorkflow],
  exports: [JdService],
})
export class JdModule {}
