import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

class McqAnswerDto {
  @ApiProperty()
  @IsUUID()
  mcqQuestionId: string;

  @ApiProperty()
  @IsString()
  selectedOption: string;
}

export class SubmitAssessmentDto {
  @ApiProperty()
  @IsUUID()
  candidateAssessmentId: string;

  @ApiProperty({
    type: [McqAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => McqAnswerDto)
  answers: McqAnswerDto[];
}
