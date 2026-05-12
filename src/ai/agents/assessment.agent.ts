import { HttpException, Injectable } from '@nestjs/common';
import {
  AssessmentPromptInput,
  buildAssessmentPrompt,
} from '../prompts/assessment.prompt';

import { parseJsonSafely } from '../parsers/json.parser';
import { GeminiService } from '../gemini-ai.service';

export interface McqQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  explanation: string;
}

export interface CodingQuestion {
  title: string;
  problem: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  expectedApproach: string;
  difficulty: string;
}

export interface AssessmentResult {
  mcqs: McqQuestion[];
  coding: CodingQuestion[];
}

@Injectable()
export class AssessmentAgent {
  constructor(private readonly aiService: GeminiService) {}

  async generateAssessment(
    input: AssessmentPromptInput,
    apiKey: string,
  ): Promise<AssessmentResult> {
    const prompt = buildAssessmentPrompt(input);

    let retries = 1;

    while (retries > 0) {
      try {
        const rawResponse = await this.aiService.generate(prompt, apiKey);

        const parsed = parseJsonSafely<AssessmentResult>(rawResponse);

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
          throw new Error('Failed to process assessment generation');
        }
      }
    }

    throw new Error('Unexpected assessment error');
  }
}
