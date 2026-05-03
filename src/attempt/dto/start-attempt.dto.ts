import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartAttemptDto {
  @ApiProperty({ example: 'evaluation-uuid' })
  @IsString({ message: 'Evaluation ID must be a string' })
  @IsNotEmpty({ message: 'Evaluation ID is required' })
  evaluationId!: string;
}
