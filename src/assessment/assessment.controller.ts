import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { AssessmentService } from './assessment.service';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtUser } from 'src/auth/interfaces/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Assessments')
@Controller('assessments')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post('generate')
  @ApiHeader({
    name: 'x-llm-provider',
    description: 'LLM Provider [gemini || openai]',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'Your Api Key',
  })
  @ApiOperation({
    summary: 'Generate AI assessment',
  })
  @ApiResponse({
    status: 201,
    description: 'Assessment generated successfully',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  async generateAssessment(
    @Body() dto: CreateAssessmentDto,
    @Headers('x-llm-provider') llmProvider: string,
    @Headers('x-api-key') apiKey: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.assessmentService.generateAssessment(
      dto,
      user,
      llmProvider,
      apiKey,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Fetch all assessments',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  async getAssessments(@CurrentUser() user: JwtUser) {
    return this.assessmentService.getAssessments(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Fetch assessment by ID',
  })
  @ApiParam({
    name: 'id',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  async getAssessment(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.assessmentService.getAssessment(id, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete assessment',
  })
  @ApiParam({
    name: 'id',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  async deleteAssessment(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.assessmentService.deleteAssessment(id, user);
  }
}
