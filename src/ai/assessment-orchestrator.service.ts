import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { JdParserAgent } from './agents/jd-parser.agent';
import { AssessmentAgent } from './agents/assessment.agent';

import { AssessmentResult } from './validators/assessment.schema';
import { AssessmentInput } from './validators/assessment.schema';

@Injectable()
export class AssessmentOrchestratorService {
  constructor(
    private readonly jdParserAgent: JdParserAgent,
    private readonly assessmentAgent: AssessmentAgent,
  ) {}

  async generateFromJD(
    jd: string,
    apiKey: string,
    overrides?: {
      mcqCount?: number;
      codingCount?: number;
    },
  ): Promise<{
    jd: AssessmentInput;
    assessment: AssessmentResult;
  }> {
    try {
      // Step 1: Parse JD
      const parsedJD = await this.jdParserAgent.parseJD(jd, apiKey);

      // Merge user overrides
      const finalInput = {
        ...parsedJD,
        mcqCount: overrides?.mcqCount ?? parsedJD.mcqCount ?? 10,
        codingCount: overrides?.codingCount ?? parsedJD.codingCount ?? 1,
      };

      // Step 2: Generate Assessment
      const assessment = await this.assessmentAgent.generateAssessment(
        finalInput,
        apiKey,
      );

      return {
        jd: finalInput,
        assessment,
      };
    } catch (error: any) {
      console.error('[ORCHESTRATOR ERROR]', error);

      throw new InternalServerErrorException(
        `Failed to generate assessment from JD: ${error.message}`,
      );
    }
  }
}
