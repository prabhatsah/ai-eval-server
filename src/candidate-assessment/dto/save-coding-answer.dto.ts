import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class CodingAnswerDto {
  @ApiProperty()
  @IsUUID()
  candidateAssessmentId: string;

  @ApiProperty()
  @IsUUID()
  codingQuestionId: string;

  @ApiProperty({
    example: 'function solve() { return true; }',
  })
  @IsString()
  @MinLength(1)
  codingAnswer: string;
}
