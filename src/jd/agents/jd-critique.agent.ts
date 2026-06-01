import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { parseJsonSafely } from 'src/ai/parsers/json.parser';

import { buildJdCritiquePrompt } from '../prompts/jd-critique.prompt';
import {
  JdCritiqueInput,
  JdCritiqueSchema,
} from '../validators/jd-critique.schema';

import { JobDescriptionInput } from '../validators/jd.schema';

@Injectable()
export class JdCritiqueAgent {
  constructor(private readonly aiService: AiService) {}

  async critique(
    jd: string,
    parsed: JobDescriptionInput,
    llmProvider: string,
    apiKey: string,
  ): Promise<JdCritiqueInput> {
    const prompt = buildJdCritiquePrompt(jd, parsed);

    const rawResponse = await this.aiService.generate(
      prompt,
      llmProvider,
      apiKey,
    );

    return parseJsonSafely(rawResponse, JdCritiqueSchema);
  }
}
