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
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResumeService } from './resume.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload the resume',
    description: 'Upload the resume',
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
  @UseGuards(JwtAuthGuard)
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
