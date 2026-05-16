import { Controller, Get, Param, Delete } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { AssessmentService } from './assessment.service';
import { AssessmentEntity } from './validators/assessment.schema';

@ApiTags('Assessments')
@Controller('assessments')
export class AssessmentController {
  constructor(private readonly service: AssessmentService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all assessments',
  })
  @ApiResponse({
    status: 200,
    description: 'List of assessments',
  })
  getAll(): AssessmentEntity[] {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get assessment by ID',
  })
  @ApiParam({ name: 'id' })
  getById(@Param('id') id: string): AssessmentEntity {
    return this.service.findById(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete assessment',
  })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
