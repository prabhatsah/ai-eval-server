import {
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class McqAnswerDto {
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
