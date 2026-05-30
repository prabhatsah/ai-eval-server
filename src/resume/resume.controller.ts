import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResumeService } from './resume.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload the resume',
    description: 'Upload the resume',
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CANDIDATE)
  async uploadResume(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req,
    @Headers('x-llm-provider') llmProvider: string,
    @Headers('x-api-key') apiKey?: string,
  ) {
    if (!llmProvider) {
      throw new BadRequestException('LLM provider is missing');
    }

    if (!apiKey) {
      throw new BadRequestException('API key is missing');
    }

    return this.resumeService.uploadResume(
      file,
      req['user'].userId,
      llmProvider,
      apiKey,
    );
  }
}
