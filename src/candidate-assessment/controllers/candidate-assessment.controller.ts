import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssignAssessmentDto } from '../dto/assign-assessment.dto';
import { StartAssessmentDto } from '../dto/start-assessment.dto';

import { CandidateAssessmentService } from '../services/candidate-assessment.service';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtUser } from 'src/auth/interfaces/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { McqAnswerDto } from '../dto/save-mcq-answer.dto';
import { CodingAnswerDto } from '../dto/save-coding-answer.dto';
import { SubmitAssessmentDto } from '../dto/submit-assessment.dto';

@ApiTags('Candidate Assessments')
@Controller('candidate-assessments')
export class CandidateAssessmentController {
  constructor(
    private readonly candidateAssessmentService: CandidateAssessmentService,
  ) {}

  // START
  @Patch('candidate/start')
  @ApiOperation({
    summary: '[Candidate] Start assessment',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE)
  async startAssessment(
    @CurrentUser() user: JwtUser,
    @Body() dto: StartAssessmentDto,
  ) {
    return this.candidateAssessmentService.startAssessment(
      user,
      dto.candidateAssessmentId,
    );
  }

  //SAVE MCQ
  @Post('candidate/save-mcq-answer')
  @ApiOperation({
    summary: '[Candidate] Save candidate MCQ answer',
  })
  @ApiResponse({
    status: 200,
    description: 'MCQ answer saved successfully',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE)
  async saveMcqAnswer(@Body() dto: McqAnswerDto) {
    return this.candidateAssessmentService.saveMcqAnswer(dto);
  }

  // SAVE CODING ANSWERS
  @Post('candidate/save-coding-answer')
  @ApiOperation({
    summary: '[Candidate] Save candidate coding answer',
  })
  @ApiResponse({
    status: 200,
    description: 'Coding answer saved successfully',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE)
  async saveCodingAnswer(@Body() dto: CodingAnswerDto) {
    return this.candidateAssessmentService.saveCodingAnswer(dto);
  }

  // SUBMIT
  @Patch('candidate/submit')
  @ApiOperation({
    summary: '[Candidate] Submit assessment',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE)
  async submitAssessment(
    @CurrentUser() user: JwtUser,
    @Body() dto: SubmitAssessmentDto,
  ) {
    return this.candidateAssessmentService.submitAssessment(user, dto);
  }

  // ASSIGN
  @Post('candidate/assign')
  @ApiOperation({
    summary: '[MANAGER] Assign assessment to candidate',
  })
  @ApiResponse({
    status: 201,
    description: 'Assessment assigned successfully',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  async assignAssessment(
    @CurrentUser() user: JwtUser,
    @Body() dto: AssignAssessmentDto,
  ) {
    return this.candidateAssessmentService.assignAssessment(user, dto);
  }

  // Used by manager to get all assessments with all the candidates asoociated with it
  @Get('manager/assessments')
  @ApiOperation({
    summary: '[MANAGER] Get all assessments with all assigned candidates',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  async getAssessmentsWithCandidates(@CurrentUser() user: JwtUser) {
    return this.candidateAssessmentService.getAssessmentsWithCandidates(user);
  }

  // used by manager to get all assessment assigned to that candidate
  @Get('manager/candidates/:candidateId')
  @ApiOperation({
    summary:
      '[MANAGER] Get candidate wise assessment, means all assignments assigned to that candidate',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  async getAllAssessmentAssignedToCandidate(
    @CurrentUser() user: JwtUser,
    @Param('candidateId') candidateId: string,
  ) {
    return this.candidateAssessmentService.getAllAssessmentAssignedToCandidate(
      user,
      candidateId,
    );
  }

  // used by manager to get specific assessment
  @Get('manager/assessments/:id')
  @ApiOperation({
    summary: '[MANAGER] Get assigned assessment details by id',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  async getById(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.candidateAssessmentService.getSpecificAssessmentForManager(
      user,
      id,
    );
  }

  // Used by candidate to get all assessments which is assigned to them
  @Get('candidate/assessments')
  @ApiOperation({
    summary: '[CANDIDATE] Get all assessments for logged in candidate',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE)
  async getAllAssessmentAssignedToLoggedInCandidate(
    @CurrentUser() user: JwtUser,
  ) {
    return this.candidateAssessmentService.getAllAssessmentAssignedToLoggedInCandidate(
      user,
    );
  }

  // Used by candidate to get one of the assigned assignment
  @Get('candidate/assessments/:id')
  @ApiOperation({
    summary: '[CANDIDATE] Get one of the assigned assigned by candidate',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllAssessmentAssignedToLoggedInCandidateById(
    @CurrentUser() user: JwtUser,
    @Param('id')
    id: string,
  ) {
    return this.candidateAssessmentService.getSpecificAssessmentForCandidate(
      user,
      id,
    );
  }

  // GET BY ID
  // @Get(':id')
  // @ApiOperation({
  //   summary: 'Get assigned assessment details by id',
  // })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // async getById(@Param('id') id: string) {
  //   return this.candidateAssessmentService.getById(id);
  // }
}
