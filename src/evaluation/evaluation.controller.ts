import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

interface EvalRequest extends Request {
  user: {
    userId: string;
  };
}

@ApiTags('Evaluations')
@ApiBearerAuth()
@Controller('evaluations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvaluationController {
  constructor(private service: EvaluationService) {}

  @Post()
  @Roles('MANAGER')
  @ApiOperation({ summary: 'Create a new evaluation (Manager only)' })
  @ApiResponse({ status: 201, description: 'Evaluation created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() dto: CreateEvaluationDto, @Req() req: EvalRequest) {
    return this.service.createEvaluation(dto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all evaluations' })
  @ApiResponse({ status: 200, description: 'List of evaluations' })
  getAll() {
    return this.service.getAllEvaluations();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get evaluation by ID' })
  @ApiParam({ name: 'id', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Evaluation found' })
  @ApiResponse({ status: 404, description: 'Evaluation not found' })
  getById(@Param('id') id: string) {
    return this.service.getEvaluationById(id);
  }
}
