import { Module } from '@nestjs/common';
import { JdController } from './jd.controller';
import { JdService } from './jd.service';
import { JdParserAgent } from './agents/jd-parser.agent';
import { AiModule } from 'src/ai/ai.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AiModule, PrismaModule, AuthModule],
  controllers: [JdController],
  providers: [JdService, JdParserAgent],
  exports: [JdService],
})
export class JdModule {}
