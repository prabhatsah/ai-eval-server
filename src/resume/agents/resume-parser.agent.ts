import { Injectable } from '@nestjs/common';
import { ResumeInput, ResumeSchema } from '../validators/resume.schema';
import { buildResumePrompt } from '../prompts/resume-parser.prompt';
import { parseJsonSafely } from 'src/ai/parsers/json.parser';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class ResumeParserAgent {
  constructor(private readonly aiService: AiService) {}

  async parseResume(
    text: string,
    llmProvider: string,
    apiKey: string,
  ): Promise<ResumeInput> {
    const prompt = buildResumePrompt(text);

    const raw = await this.aiService.generate(prompt, llmProvider, apiKey);

    return parseJsonSafely(raw, ResumeSchema);
  }
}
