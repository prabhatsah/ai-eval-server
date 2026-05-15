import { ApiProperty } from '@nestjs/swagger';
import { GenerateAssessmentResponseDto } from './assessment.dto';

export class GenerateFromJdDto {
  @ApiProperty({
    example:
      'We are looking for a Backend Engineer with 3+ years experience in Node.js, SQL, REST APIs. Knowledge of Docker and Redis is a plus.',
    description: 'Full job description text',
  })
  jd: string;

  @ApiProperty({
    example: 10,
    required: false,
    description: 'Optional MCQ count (default 10)',
  })
  mcqCount?: number;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Optional coding question count (default 1)',
  })
  codingCount?: number;
}

export class ParsedJdDto {
  @ApiProperty({ example: 'Backend Engineer' })
  role: string;

  @ApiProperty({ example: ['Node.js', 'SQL', 'REST APIs'], type: [String] })
  primarySkills: string[];

  @ApiProperty({ example: ['Docker', 'Redis'], type: [String] })
  secondarySkills: string[];

  @ApiProperty({ example: 3 })
  experienceYears: number;

  @ApiProperty({ example: 'medium' })
  difficulty: string;

  @ApiProperty({ example: 10 })
  mcqCount: number;

  @ApiProperty({ example: 1 })
  codingCount: number;

  @ApiProperty({
    example: ['API design', 'database optimization'],
    type: [String],
  })
  focusAreas: string[];
}

export class GenerateFromJdResponseDto {
  @ApiProperty({
    type: ParsedJdDto,
    description: 'Structured JD data extracted by AI',
  })
  jd: ParsedJdDto;

  @ApiProperty({
    type: GenerateAssessmentResponseDto,
    description: 'Generated assessment based on JD',
  })
  assessment: GenerateAssessmentResponseDto;
}
``;
