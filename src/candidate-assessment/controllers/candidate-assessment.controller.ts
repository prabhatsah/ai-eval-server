import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AssignAssessmentDto } from '../dto/assign-assessment.dto';
import { StartAssessmentDto } from '../dto/start-assessment.dto';
import { SubmitAssessmentDto } from '../dto/submit-assessment.dto';
import { CandidateAssessmentService } from '../services/candidate-assessment.service';

@ApiTags('Candidate Assessments')
@Controller('candidate-assessments')
export class CandidateAssessmentController {
  constructor(
    private readonly candidateAssessmentService: CandidateAssessmentService,
  ) {}

  // ASSIGN
  @Post('assign')
  @ApiOperation({
    summary: 'Assign assessment to candidate',
  })
  @ApiResponse({
    status: 201,
    description: 'Assessment assigned successfully',
  })
  async assignAssessment(@Body() dto: AssignAssessmentDto) {
    return this.candidateAssessmentService.assignAssessment(dto);
  }

  // START
  @Patch('start')
  @ApiOperation({
    summary: 'Start candidate assessment',
  })
  async startAssessment(@Body() dto: StartAssessmentDto) {
    return this.candidateAssessmentService.startAssessment(
      dto.candidateAssessmentId,
    );
  }

  // SUBMIT
  @Patch('submit')
  @ApiOperation({
    summary: 'Submit candidate assessment',
  })
  async submitAssessment(@Body() dto: SubmitAssessmentDto) {
    return this.candidateAssessmentService.submitAssessment(dto);
  }

  // GET BY ID
  @Get(':id')
  @ApiOperation({
    summary: 'Get assigned assessment details by id',
  })
  async getById(@Param('id') id: string) {
    return this.candidateAssessmentService.getById(id);
  }

  // GET CANDIDATE ASSESSMENTS
  @Get('candidate/:candidateId')
  @ApiOperation({
    summary: 'Get assessments assigned to candidate',
  })
  async getCandidateAssessments(
    @Param('candidateId')
    candidateId: string,
  ) {
    return this.candidateAssessmentService.getCandidateAssessments(candidateId);
  }
}
