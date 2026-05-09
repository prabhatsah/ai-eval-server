import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';
import {
  AssessmentPromptInput,
  buildAssessmentPrompt,
} from '../prompts/assessment.prompt';

import { parseJsonSafely } from '../parsers/json.parser';

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
  constructor(private readonly aiService: AiService) {}

  async generateAssessment(
    input: AssessmentPromptInput,
  ): Promise<AssessmentResult> {
    const prompt = buildAssessmentPrompt(input);

    let retries = 3;

    while (retries > 0) {
      try {
        const rawResponse = await this.aiService.generate(prompt);

        const parsed = parseJsonSafely<AssessmentResult>(rawResponse);

        return parsed;
      } catch (error) {
        retries--;

        if (retries === 0) {
          throw new Error('Failed to generate valid assessment');
        }
      }
    }

    throw new Error('Unexpected error');
  }
}
