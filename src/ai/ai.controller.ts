import { Body, Controller, Post } from '@nestjs/common';
import { AssessmentAgent } from './agents/assessment.agent';
import { InterviewAgent } from './agents/interview.agent';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ProcessInterviewDto,
  ProcessInterviewResponseDto,
} from './dto/ai-interview.dto';
import {
  GenerateAssessmentDto,
  GenerateAssessmentResponseDto,
} from './dto/assessment.dto';

@ApiTags('Assessment')
@Controller('ai')
export class AiController {
  constructor(
    private readonly assessmentAgent: AssessmentAgent,
    private readonly interviewAgent: InterviewAgent,
  ) {}

  @Post('generate-assessment')
  @ApiOperation({
    summary: 'Generate MCQ and coding assessment questions',
  })
  @ApiBody({
    type: GenerateAssessmentDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Assessment generated successfully',
    type: GenerateAssessmentResponseDto,
  })
  async generateAssessment(@Body() body: any) {
    return this.assessmentAgent.generateAssessment({
      topic: body.topic,
      difficulty: body.difficulty,
      mcqCount: body.mcqCount,
      codingCount: body.codingCount,
    });
  }

  @Post('interview')
  @ApiOperation({
    summary: 'Process interview answer and generate next question',
  })
  @ApiBody({
    type: ProcessInterviewDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Interview evaluation and next question generated successfully',
    type: ProcessInterviewResponseDto,
  })
  async processInterview(@Body() body: any) {
    return this.interviewAgent.processInterview({
      topic: body.topic,
      history: body.history,
      latestAnswer: body.latestAnswer,
    });
  }
}
