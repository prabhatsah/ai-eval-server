import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { parseJsonSafely } from 'src/ai/parsers/json.parser';

import {
  JobDescriptionInput,
  JobDescriptionSchema,
} from '../validators/jd.schema';

@Injectable()
export class JdParserAgent {
  constructor(private readonly aiService: AiService) {}

  async parseJd(
    prompt: string,
    llmProvider: string,
    apiKey: string,
  ): Promise<JobDescriptionInput> {
    const rawResponse = await this.aiService.generate(
      prompt,
      llmProvider,
      apiKey,
    );

    return parseJsonSafely(rawResponse, JobDescriptionSchema);
  }
}
