import { JobDescriptionInput } from '../validators/jd.schema';
import { JdCritiqueDto } from './jd-critique.dto';

export class JdWorkflowResultDto {
  parsed: JobDescriptionInput;
  critique: JdCritiqueDto;
  totalAttempts: number;
}
