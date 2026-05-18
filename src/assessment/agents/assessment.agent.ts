import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { AiService } from 'src/ai/ai.service';

import { parseJsonSafely } from 'src/ai/parsers/json.parser';

import {
  AssessmentGenerationInput,
  AssessmentGenerationSchema,
} from '../validators/assessment.schema';

import { buildAssessmentPrompt } from '../prompts/assessment.prompt';

@Injectable()
export class AssessmentAgent {
  constructor(private readonly aiService: AiService) {}

  async generateAssessment(
    payload: {
      role: string;
      primarySkills: string[];
      secondarySkills?: string[];
      experienceYears?: number;
      difficulty: string;
      focusAreas?: string[];
      mcqCount: number;
      codingCount: number;
    },
    apiKey: string,
  ): Promise<AssessmentGenerationInput> {
    const prompt = buildAssessmentPrompt(payload);

    let retries = 3;

    while (retries > 0) {
      try {
        const rawResponse = await this.aiService.generate(prompt, apiKey);

        const parsed = parseJsonSafely(rawResponse, AssessmentGenerationSchema);

        this.validateAssessment(parsed, payload);

        return parsed;
      } catch (error: any) {
        if (error instanceof HttpException) {
          throw error;
        }

        retries--;

        if (retries === 0) {
          throw new InternalServerErrorException(
            `Assessment generation failed: ${error.message}`,
          );
        }
      }
    }

    throw new Error('Unexpected assessment generation error');
  }

  private validateAssessment(
    data: AssessmentGenerationInput,
    payload: {
      mcqCount: number;
      codingCount: number;
    },
  ) {
    if (data.mcqs.length !== payload.mcqCount) {
      throw new Error('MCQ count mismatch');
    }

    if (data.codingQuestions.length !== payload.codingCount) {
      throw new Error('Coding question count mismatch');
    }

    return true;
  }
}
