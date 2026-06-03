import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class McqAnswerDto {
  @ApiProperty()
  @IsUUID()
  candidateAssessmentId: string;

  @ApiProperty()
  @IsUUID()
  mcqQuestionId: string;

  @ApiProperty({
    minimum: -1,
    maximum: 3,
    example: 1,
  })
  @IsInt()
  @Min(-1)
  @Max(3)
  selectedOptionIndex: number;
}
