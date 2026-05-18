import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';

import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { AssessmentService } from './assessment.service';

@ApiTags('Assessments')
@Controller('assessments')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate AI assessment',
  })
  @ApiResponse({
    status: 201,
    description: 'Assessment generated successfully',
  })
  async generateAssessment(
    @Body() dto: CreateAssessmentDto,

    @Headers('x-api-key') apiKey: string,
  ) {
    return this.assessmentService.generateAssessment(dto, apiKey);
  }

  @Get()
  @ApiOperation({
    summary: 'Fetch all assessments',
  })
  async getAssessments() {
    return this.assessmentService.getAssessments();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Fetch assessment by ID',
  })
  @ApiParam({
    name: 'id',
  })
  async getAssessment(@Param('id') id: string) {
    return this.assessmentService.getAssessment(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete assessment',
  })
  @ApiParam({
    name: 'id',
  })
  async deleteAssessment(@Param('id') id: string) {
    return this.assessmentService.deleteAssessment(id);
  }
}
