import { ApiProperty } from '@nestjs/swagger';

/* =========================
   Request DTO
========================= */

export class GenerateAssessmentDto {
  @ApiProperty({
    example: 'Backend Engineer',
    description: 'Target role for the assessment',
  })
  role: string;

  @ApiProperty({
    example: ['Node.js', 'SQL', 'REST APIs'],
    description: 'Primary skills that must be covered in the assessment',
    type: [String],
  })
  primarySkills: string[];

  @ApiProperty({
    example: ['Docker', 'Redis'],
    description: 'Optional secondary skills',
    type: [String],
    required: false,
  })
  secondarySkills?: string[];

  @ApiProperty({
    example: 3,
    description: 'Years of experience of the candidate',
    required: false,
  })
  experienceYears?: number;

  @ApiProperty({
    example: 'medium',
    description: 'Difficulty level of the assessment',
    enum: ['easy', 'medium', 'hard'],
  })
  difficulty: 'easy' | 'medium' | 'hard';

  @ApiProperty({
    example: 10,
    description: 'Number of MCQ questions (default = 10)',
    required: false,
  })
  mcqCount: number;

  @ApiProperty({
    example: 1,
    description: 'Number of coding questions (default = 1)',
    required: false,
  })
  codingCount: number;

  @ApiProperty({
    example: ['API design', 'database optimization'],
    description: 'Focus areas for question generation',
    type: [String],
    required: false,
  })
  focusAreas?: string[];
}

/* =========================
   Response DTOs
========================= */

export class McqDto {
  @ApiProperty({
    example:
      'A Node.js API intermittently returns 500 errors under load. What is the most likely cause?',
    description: 'MCQ question',
  })
  question: string;

  @ApiProperty({
    example: 'Node.js',
    description: 'Skill this question belongs to',
  })
  skill: string;

  @ApiProperty({
    example: [
      'A) Event loop blocking due to sync code',
      'B) DNS lookup failure',
      'C) Incorrect HTTP method',
      'D) Missing environment variables',
    ],
    description: 'Available answer options',
    type: [String],
  })
  options: string[];

  @ApiProperty({
    example: 'A',
    description: 'Correct answer option',
  })
  correctAnswer: string;

  @ApiProperty({
    example: 'medium',
    description: 'Difficulty level of the MCQ',
  })
  difficulty: string;

  @ApiProperty({
    example:
      'Synchronous operations block the event loop, causing request handling delays and failures under load.',
    description: 'Explanation of the correct answer',
  })
  explanation: string;
}

export class CodingQuestionDto {
  @ApiProperty({
    example: 'Build a Rate-Limited API Endpoint',
    description: 'Title of the coding problem',
  })
  title: string;

  @ApiProperty({
    example:
      'Design a REST API endpoint in Node.js that limits requests per user to 100 requests per minute. Exceeding requests should return HTTP 429.',
    description: 'Detailed coding problem statement',
  })
  problem: string;

  @ApiProperty({
    example:
      'The solution must handle concurrent users efficiently. Avoid in-memory-only solutions for scalability.',
    description: 'Constraints for solving the problem',
  })
  constraints: string;

  @ApiProperty({
    example: 'User sends 120 requests in 1 minute',
    description: 'Sample input for the coding problem',
  })
  sampleInput: string;

  @ApiProperty({
    example: 'First 100 requests succeed, next 20 return 429',
    description: 'Expected sample output',
  })
  sampleOutput: string;

  @ApiProperty({
    example:
      'Use middleware with Redis to track request counts per user and reset using expiration policies.',
    description: 'Suggested approach to solve the problem',
  })
  expectedApproach: string;

  @ApiProperty({
    example: 'medium',
    description: 'Difficulty level of the coding question',
  })
  difficulty: string;
}

export class GenerateAssessmentResponseDto {
  @ApiProperty({
    type: [McqDto],
    description: 'List of generated MCQ questions',
  })
  mcqs: McqDto[];

  @ApiProperty({
    type: [CodingQuestionDto],
    description: 'List of generated coding questions',
  })
  coding: CodingQuestionDto[];
}
