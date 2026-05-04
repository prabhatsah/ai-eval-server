import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { StartAttemptDto } from './dto/start-attempt.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

interface AuthRequest extends Request {
  user: {
    userId: string;
    role?: string;
  };
}

@ApiTags('Attempts')
@ApiBearerAuth()
@Controller('attempt')
@UseGuards(JwtAuthGuard)
export class AttemptController {
  constructor(private service: AttemptService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new attempt' })
  @ApiResponse({ status: 201, description: 'Attempt started successfully' })
  start(@Req() req: AuthRequest, @Body() body: StartAttemptDto) {
    return this.service.startAttempt(req.user.userId, body.evaluationId);
  }

  @Post('answer')
  @ApiOperation({ summary: 'Submit answer for a question' })
  @ApiResponse({ status: 201, description: 'Answer submitted successfully' })
  submit(@Body() body: SubmitAnswerDto) {
    return this.service.submitAnswer(body);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Finalize attempt and calculate score' })
  @ApiResponse({ status: 200, description: 'Attempt submitted successfully' })
  finalize(@Body('attemptId') attemptId: string) {
    return this.service.finalizeAttempt(attemptId);
  }
}
