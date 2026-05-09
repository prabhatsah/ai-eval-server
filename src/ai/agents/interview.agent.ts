import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';

import { InterviewInput, InterviewResult } from '../types/interview.types';

import { buildInterviewPrompt } from '../prompts/interview.prompt';

import { parseJsonSafely } from '../parsers/json.parser';

@Injectable()
export class InterviewAgent {
  constructor(private readonly aiService: AiService) {}

  async processInterview(input: InterviewInput): Promise<InterviewResult> {
    const prompt = buildInterviewPrompt(input);

    let retries = 3;

    while (retries > 0) {
      try {
        const rawResponse = await this.aiService.generate(prompt);

        const parsed = parseJsonSafely<InterviewResult>(rawResponse);

        return parsed;
      } catch (error) {
        retries--;

        if (retries === 0) {
          throw new Error('Failed to process interview response');
        }
      }
    }

    throw new Error('Unexpected interview error');
  }
}
