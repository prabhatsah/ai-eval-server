import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { parseJsonSafely } from 'src/ai/parsers/json.parser';
import {
  AssessmentCriticInput,
  AssessmentCriticSchema,
} from '../validators/assessment-critic.schema';
import { buildAssessmentCriticPrompt } from '../prompts/assessment-critic.prompt';

@Injectable()
export class AssessmentCriticAgent {
  constructor(private readonly aiService: AiService) {}

  async criticAssessment(
    input: {
      role: string;
      difficulty: string;
      experienceYears?: number | null;
      primarySkills: string[];
      secondarySkills?: string[];
      focusAreas?: string[];
      mcqs: any[];
      codingQuestions: any[];
    },
    llmProvider: string,
    apiKey: string,
  ): Promise<AssessmentCriticInput> {
    const prompt = buildAssessmentCriticPrompt(input);

    let retries = 3;

    while (retries > 0) {
      try {
        const rawResponse = await this.aiService.generate(
          prompt,
          llmProvider,
          apiKey,
        );

        const parsed = parseJsonSafely(rawResponse, AssessmentCriticSchema);

        this.validateCritic(parsed);

        return parsed;
      } catch (error: any) {
        if (error instanceof HttpException) {
          throw error;
        }

        console.error('[ASSESSMENT CRITIC ERROR]', error.message);

        retries--;

        if (retries === 0) {
          throw new InternalServerErrorException(
            `Failed to critic assessment: ${error.message}`,
          );
        }
      }
    }

    throw new Error('Unexpected assessment critic error');
  }

  private validateCritic(data: AssessmentCriticInput) {
    // Hard rejection rules
    if (data.overallQualityScore < 40 || data.relevanceScore < 50) {
      data.recommendation = 'rejected';
      return;
    }

    // Revision rules
    if (
      data.duplicateQuestionScore < 70 ||
      data.clarityScore < 60 ||
      data.practicalityScore < 60
    ) {
      data.recommendation = 'revise';
      return;
    }

    // Approved
    data.recommendation = 'approved';
  }
}
