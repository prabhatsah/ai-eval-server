import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { GeminiService } from './bak-gemini-ai.service';

@Module({
  providers: [AiService, GeminiService],
  exports: [AiService],
})
export class AiModule {}
