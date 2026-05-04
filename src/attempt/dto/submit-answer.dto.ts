import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum QuestionType {
  MCQ = 'MCQ',
  CODING = 'CODING',
  AI = 'AI',
}

export class SubmitAnswerDto {
  @ApiProperty({ example: 'attempt-uuid' })
  @IsString({ message: 'Attempt ID must be a string' })
  @IsNotEmpty({ message: 'Attempt ID is required' })
  attemptId!: string;

  @ApiProperty({ example: 'What is closure in JavaScript?' })
  @IsString({ message: 'Question must be a string' })
  @IsNotEmpty({ message: 'Question is required' })
  question!: string;

  @ApiProperty({ example: 'A closure is a function with preserved scope...' })
  @IsString({ message: 'Answer must be a string' })
  @IsNotEmpty({ message: 'Answer is required' })
  answer!: string;

  @ApiProperty({ enum: QuestionType, example: QuestionType.AI })
  @IsEnum(QuestionType, { message: 'Type must be MCQ, CODING, or AI' })
  type!: QuestionType;
}
