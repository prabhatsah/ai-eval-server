import { HttpException, Injectable } from '@nestjs/common';
import { buildAssessmentPrompt } from '../prompts/assessment.prompt';

import { parseJsonSafely } from '../parsers/json.parser';
import { GeminiService } from '../gemini-ai.service';

import {
  AssessmentResultSchema,
  AssessmentInput,
  AssessmentResult,
  AssessmentInputSchema,
} from '../validators/assessment.schema';
import { AiService } from '../ai.service';

@Injectable()
export class AssessmentAgent {
  constructor(private readonly aiService: AiService) {}

  async generateAssessment(
    input: AssessmentInput,
    apiKey: string,
  ): Promise<AssessmentResult> {
    const validatedInput = AssessmentInputSchema.parse(input);

    const prompt = buildAssessmentPrompt(validatedInput);

    let retries = 1;

    while (retries > 0) {
      try {
        const rawResponse = await this.aiService.generate(prompt, apiKey);

        const parsed = parseJsonSafely(rawResponse, AssessmentResultSchema);

        return parsed;
      } catch (error) {
        /**
         * If already a NestJS HTTP exception,
         * rethrow immediately
         */
        if (error instanceof HttpException) {
          throw error;
        }

        retries--;

        if (retries === 0) {
          throw new Error(`Failed after retries: ${error.message}`);
        }
      }
    }

    throw new Error('Unexpected assessment error');
  }
}
