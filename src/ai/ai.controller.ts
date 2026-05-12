import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { AssessmentAgent } from './agents/assessment.agent';
import { InterviewAgent } from './agents/interview.agent';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ProcessInterviewDto,
  ProcessInterviewResponseDto,
} from './dto/ai-interview.dto';
import {
  GenerateAssessmentDto,
  GenerateAssessmentResponseDto,
} from './dto/assessment.dto';
import { ApiCommonErrorResponses } from 'src/common/decorators/api-common-error-responses.decorator';

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
  @ApiHeader({
    name: 'x-gemini-api-key',
    description: 'Gemini API Key',
    required: false,
  })
  @ApiBody({
    type: GenerateAssessmentDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Assessment generated successfully',
    type: GenerateAssessmentResponseDto,
  })
  @ApiCommonErrorResponses()
  async generateAssessment(
    @Body() body: GenerateAssessmentDto,
    @Headers('x-gemini-api-key') apiKey?: string,
  ) {
    const finalApiKey = apiKey; //|| process.env.GEMINI_API_KEY;

    if (!finalApiKey) {
      throw new BadRequestException('Gemini API key is missing');
    }

    return this.assessmentAgent.generateAssessment(
      {
        topic: body.topic,
        difficulty: body.difficulty,
        mcqCount: body.mcqCount,
        codingCount: body.codingCount,
      },
      finalApiKey,
    );
  }

  @Post('interview')
  @ApiOperation({
    summary: 'Process interview answer and generate next question',
  })
  @ApiHeader({
    name: 'x-gemini-api-key',
    description: 'Gemini API Key',
    required: false,
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
  @ApiCommonErrorResponses()
  async processInterview(
    @Body() body: ProcessInterviewDto,
    @Headers('x-gemini-api-key') apiKey?: string,
  ) {
    const finalApiKey = apiKey; //|| process.env.GEMINI_API_KEY;

    if (!finalApiKey) {
      throw new BadRequestException('Gemini API key is missing');
    }

    return this.interviewAgent.processInterview(
      {
        topic: body.topic,
        history: body.history,
        latestAnswer: body.latestAnswer,
      },
      finalApiKey,
    );
  }
}
