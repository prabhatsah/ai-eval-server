import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitAssessmentDto {
  @ApiProperty()
  @IsUUID()
  candidateAssessmentId: string;
}
