import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JdModule } from './jd/jd.module';
import { AssessmentModule } from './assessment/assessment.module';
import { CandidateAssessmentModule } from './candidate-assessment/candidate-assessment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    // EvaluationModule,
    // AttemptModule,
    // AiModule,
    JdModule,
    AssessmentModule,
    CandidateAssessmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
