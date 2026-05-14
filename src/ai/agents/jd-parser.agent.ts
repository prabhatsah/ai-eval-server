import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { buildJdParsingPrompt } from '../prompts/jd-parser.prompt';
import { parseJsonSafely } from '../parsers/json.parser';

import {
  AssessmentInput,
  AssessmentInputSchema,
} from '../validators/assessment.schema';
import { AiService } from '../ai.service';

@Injectable()
export class JdParserAgent {
  constructor(private readonly aiService: AiService) {}

  async parseJD(jd: string, apiKey: string): Promise<AssessmentInput> {
    const prompt = buildJdParsingPrompt(jd);

    let retries = 3;

    while (retries > 0) {
      try {
        const rawResponse = await this.aiService.generate(prompt, apiKey);

        const parsed = parseJsonSafely(rawResponse, AssessmentInputSchema);

        // Business-level validation (IMPORTANT)
        this.validateParsedJD(parsed);

        return parsed;
      } catch (error: any) {
        if (error instanceof HttpException) {
          throw error;
        }

        console.error('[JD PARSER ERROR]', error.message);

        retries--;

        if (retries === 0) {
          throw new InternalServerErrorException(
            `Failed to parse JD after retries: ${error.message}`,
          );
        }
      }
    }

    throw new Error('Unexpected JD parsing error');
  }

  /* =========================
     Extra Validation Layer
  ========================= */

  private validateParsedJD(data: AssessmentInput) {
    if (!data.role) {
      throw new Error('Missing role in JD parsing');
    }

    if (!data.primarySkills || data.primarySkills.length < 1) {
      throw new Error('Primary skills missing');
    }

    if (!data.difficulty) {
      throw new Error('Difficulty missing');
    }

    return true;
  }
}
