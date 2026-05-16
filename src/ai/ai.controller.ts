import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';
import { AssessmentAgent } from './agents/assessment.agent';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GenerateAssessmentDto,
  GenerateAssessmentResponseDto,
} from './dto/assessment.dto';
import { ApiCommonErrorResponses } from 'src/common/decorators/api-common-error-responses.decorator';
import {
  GenerateFromJdDto,
  GenerateFromJdResponseDto,
} from './dto/generate-from-jd.dto';
import { AssessmentOrchestratorService } from './assessment-orchestrator.service';

@ApiTags('Assessment')
@Controller('ai')
export class AiController {
  constructor(
    private readonly assessmentAgent: AssessmentAgent,
    private readonly orchestratorService: AssessmentOrchestratorService,
  ) {}

  @Post('generate-assessment')
  @ApiOperation({
    summary: 'Generate MCQ and coding assessment questions',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key',
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
    @Headers('x-api-key') apiKey?: string,
  ) {
    if (!apiKey) {
      throw new BadRequestException('API key is missing');
    }

    return this.assessmentAgent.generateAssessment(
      {
        ...body,
        mcqCount: body.mcqCount ?? 10,
        codingCount: body.codingCount ?? 1,
      },
      apiKey,
    );
  }

  @Post('generate-from-jd')
  @ApiOperation({
    summary: 'Generate assessment from job description',
    description:
      'Parses a job description to extract structured hiring signals and generates a complete technical assessment.',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key for AI provider',
    required: false,
  })
  @ApiBody({
    type: GenerateFromJdDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Assessment generated successfully from JD',
    type: GenerateFromJdResponseDto,
  })
  async generateFromJd(
    @Body() body: GenerateFromJdDto,
    @Headers('x-api-key') apiKey?: string,
  ) {
    const finalApiKey = apiKey;

    if (!finalApiKey) {
      throw new BadRequestException('API key is missing');
    }

    if (!body.jd) {
      throw new BadRequestException('Job description is required');
    }

    return this.orchestratorService.generateFromJD(body.jd, apiKey, {
      mcqCount: body.mcqCount,
      codingCount: body.codingCount,
    });
  }

  // @Post('interview')
  // @ApiOperation({
  //   summary: 'Process interview answer and generate next question',
  // })
  // @ApiHeader({
  //   name: 'x-gemini-api-key',
  //   description: 'Gemini API Key',
  //   required: false,
  // })
  // @ApiBody({
  //   type: ProcessInterviewDto,
  // })
  // @ApiResponse({
  //   status: 200,
  //   description:
  //     'Interview evaluation and next question generated successfully',
  //   type: ProcessInterviewResponseDto,
  // })
  // @ApiCommonErrorResponses()
  // async processInterview(
  //   @Body() body: ProcessInterviewDto,
  //   @Headers('x-gemini-api-key') apiKey?: string,
  // ) {
  //   const finalApiKey = apiKey; //|| process.env.GEMINI_API_KEY;

  //   if (!finalApiKey) {
  //     throw new BadRequestException('Gemini API key is missing');
  //   }

  //   return this.interviewAgent.processInterview(
  //     {
  //       topic: body.topic,
  //       history: body.history,
  //       latestAnswer: body.latestAnswer,
  //     },
  //     finalApiKey,
  //   );
  // }
}
