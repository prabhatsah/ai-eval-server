import {
  Body,
  Controller,
  Headers,
  Post,
  BadRequestException,
  Get,
  Param,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiHeader,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';

import { JdService } from './jd.service';
import { ParseJdDto, JdResponseDto } from './dto/jd.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('Job Description')
@Controller('jd')
export class JdController {
  constructor(private readonly jdService: JdService) {}

  /* =========================
     Parse JD
  ========================= */
  @Post()
  @ApiOperation({
    summary: 'Parse a job description',
    description: 'Parses a raw JD and stores structured data in database',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiHeader({
    name: 'x-llm-provider',
    description: 'LLM Provider [ gemini | openai ]',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'Your Api Key',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  @ApiResponse({
    status: 200,
    type: JdResponseDto,
  })
  async parseJd(
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-llm-provider') llmProvider: string,
    @Headers('x-api-key') apiKey?: string,
  ) {
    if (!llmProvider) {
      throw new BadRequestException('LLM provider is missing');
    }

    if (!apiKey) {
      throw new BadRequestException('API key is missing');
    }

    return this.jdService.parseJd(file, llmProvider, apiKey);
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

  // @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all job descriptions',
  })
  async getAll() {
    return this.jdService.getAll();
  }
}
