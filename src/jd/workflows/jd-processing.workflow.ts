import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JdCritiqueAgent } from '../agents/jd-critique.agent';
import { buildJdRepairPrompt } from '../prompts/jd-repair.prompt';
import { JD_PROCESSING } from '../constants/jd.constants';
import { JdWorkflowResultDto } from '../dto/jd-workflow-result.dto';
import { JdParserAgent } from '../agents/jd-parser.agent';
import { buildJdParsingPrompt } from '../prompts/jd-parser.prompt';

@Injectable()
export class JdProcessingWorkflow {
  constructor(
    private readonly parserAgent: JdParserAgent,
    private readonly critiqueAgent: JdCritiqueAgent,
  ) {}

  async execute(
    jd: string,
    llmProvider: string,
    apiKey: string,
  ): Promise<JdWorkflowResultDto> {
    let attempts = 0;
    console.log('Workflow started');

    let currentPrompt = buildJdParsingPrompt(jd);

    while (attempts < JD_PROCESSING.MAX_RETRIES) {
      attempts++;
      console.log('Attempts: ', attempts);

      const generated = await this.parserAgent.parseJd(
        currentPrompt,
        llmProvider,
        apiKey,
      );

      const critique = await this.critiqueAgent.critique(
        jd,
        generated,
        llmProvider,
        apiKey,
      );
      console.log('Critique feedback: ', critique);

      if (critique.passed) {
        return {
          parsed: generated,
          critique,
          totalAttempts: attempts,
        };
      }

      currentPrompt = buildJdRepairPrompt(jd, generated, critique);
    }

    throw new InternalServerErrorException(
      'JD workflow failed after maximum retries',
    );
  }
}
