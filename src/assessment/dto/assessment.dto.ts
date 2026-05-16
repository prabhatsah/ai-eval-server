import { ApiProperty } from '@nestjs/swagger';

export class AssessmentIdParamDto {
  @ApiProperty({
    example: 'uuid-123',
  })
  id: string;
}

export class CreateAssessmentDto {
  @ApiProperty({
    example: 'Backend Engineer',
  })
  role: string;

  @ApiProperty({
    type: [String],
    example: ['Node.js', 'SQL'],
  })
  primarySkills: string[];

  @ApiProperty({
    type: [String],
    required: false,
  })
  secondarySkills?: string[];

  @ApiProperty({
    example: 3,
    required: false,
  })
  experienceYears?: number;

  @ApiProperty({
    example: 'medium',
  })
  difficulty: string;

  @ApiProperty({
    example: 10,
  })
  mcqCount: number;

  @ApiProperty({
    example: 1,
  })
  codingCount: number;

  @ApiProperty({
    type: [String],
    required: false,
  })
  focusAreas?: string[];
}
