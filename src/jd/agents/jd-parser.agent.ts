import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { parseJsonSafely } from 'src/ai/parsers/json.parser';

import {
  JobDescriptionInput,
  JobDescriptionSchema,
} from '../validators/jd.schema';
import { buildJdParsingPrompt } from '../prompts/jd-parser.prompt';

@Injectable()
export class JdParserAgent {
  constructor(private readonly aiService: AiService) {}

  async parseJD(jd: string, apiKey: string): Promise<JobDescriptionInput> {
    const prompt = buildJdParsingPrompt(jd);

    let retries = 3;

    while (retries > 0) {
      try {
        const rawResponse = await this.aiService.generate(prompt, apiKey);

        const parsed = parseJsonSafely(rawResponse, JobDescriptionSchema);

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

  private validateParsedJD(data: JobDescriptionInput) {
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
