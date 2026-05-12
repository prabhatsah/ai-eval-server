import { HttpException, Injectable } from '@nestjs/common';

import { InterviewInput, InterviewResult } from '../types/interview.types';

import { buildInterviewPrompt } from '../prompts/interview.prompt';

import { parseJsonSafely } from '../parsers/json.parser';
import { GeminiService } from '../gemini-ai.service';

@Injectable()
export class InterviewAgent {
  constructor(private readonly aiService: GeminiService) {}

  async processInterview(
    input: InterviewInput,
    apiKey: string,
  ): Promise<InterviewResult> {
    const prompt = buildInterviewPrompt(input);

    let retries = 1;

    while (retries > 0) {
      try {
        const rawResponse = await this.aiService.generate(prompt, apiKey);

        const parsed = parseJsonSafely<InterviewResult>(rawResponse);

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
          throw new Error('Failed to process interview response');
        }
      }
    }

    throw new Error('Unexpected interview error');
  }
}
