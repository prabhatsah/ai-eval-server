import {
  Body,
  Controller,
  Headers,
  Post,
  BadRequestException,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiHeader,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import { JdService } from './jd.service';
import { CreateJdDto, JdResponseDto } from './dto/jd.dto';

@ApiTags('Job Description')
@Controller('jd')
export class JdController {
  constructor(private readonly jdService: JdService) {}

  /* =========================
     Parse JD
  ========================= */
  @Post()
  @ApiOperation({
    summary: 'Create and parse a job description',
    description: 'Parses a raw JD and stores structured data in database',
  })
  @ApiHeader({
    name: 'x-api-key',
    required: false,
  })
  @ApiBody({
    type: CreateJdDto,
  })
  @ApiResponse({
    status: 200,
    type: JdResponseDto,
  })
  async createJd(
    @Body() body: CreateJdDto,
    @Headers('x-api-key') apiKey?: string,
  ) {
    if (!apiKey) {
      throw new BadRequestException('API key is missing');
    }

    if (!body.jd) {
      throw new BadRequestException('JD text is required');
    }

    return this.jdService.createJd(body.jd, apiKey);
  }

  /* =========================
     GET JD BY ID
  ========================= */

  @Get(':id')
  @ApiOperation({
    summary: 'Get job description by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'JD ID',
  })
  @ApiResponse({
    status: 200,
    type: JdResponseDto,
  })
  async getById(@Param('id') id: string) {
    const jd = await this.jdService.getById(id);

    if (!jd) {
      throw new NotFoundException('JD not found');
    }

    return jd;
  }

  /* =========================
     GET LATEST JD BY GROUP
  ========================= */

  @Get('group/:groupId')
  @ApiOperation({
    summary: 'Get latest JD by groupId',
  })
  @ApiParam({
    name: 'groupId',
  })
  async getLatest(@Param('groupId') groupId: string) {
    return this.jdService.getLatestByGroup(groupId);
  }

  /* =========================
     GET ALL JDs
  ========================= */

  @Get()
  @ApiOperation({
    summary: 'Get all job descriptions',
  })
  async getAll() {
    return this.jdService.getAll();
  }
}
