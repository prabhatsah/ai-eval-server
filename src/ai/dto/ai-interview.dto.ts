import { ApiProperty } from '@nestjs/swagger';

/* =========================
   Request DTO
========================= */
export class InterviewHistoryDto {
  @ApiProperty({
    example: 'What is virtual DOM?',
    description: 'Previously asked interview question',
  })
  question: string;

  @ApiProperty({
    example: 'It is a lightweight copy of real DOM',
    description: 'Candidate answer for the question',
  })
  answer: string;
}

export class ProcessInterviewDto {
  @ApiProperty({
    example: 'React',
    description: 'Interview topic or technology',
  })
  topic: string;

  @ApiProperty({
    type: [InterviewHistoryDto],
    description: 'Previous interview questions and answers',
  })
  history: InterviewHistoryDto[];

  @ApiProperty({
    example: 'React compares changes efficiently before updating DOM.',
    description: 'Latest answer provided by the candidate',
  })
  latestAnswer: string;
}

/* =========================
   Response DTOs
========================= */

export class EvaluationDto {
  @ApiProperty({
    example: 3,
    description: 'Score given to the latest answer',
  })
  score: number;

  @ApiProperty({
    example: 70,
    description: 'Confidence percentage of the evaluation',
  })
  confidence: number;

  @ApiProperty({
    example: ['Understands basic concept of virtual DOM'],
    description: 'Strong points identified in the answer',
  })
  strengths: string[];

  @ApiProperty({
    example: ['Lacks detail on how React optimizes updates'],
    description: 'Areas where the answer needs improvement',
  })
  weaknesses: string[];
}

export class NextQuestionDto {
  @ApiProperty({
    example:
      'How does React optimize the process of updating the real DOM when state or props change?',
    description: 'Next interview question generated for the candidate',
  })
  question: string;

  @ApiProperty({
    example: 'medium',
    description: 'Difficulty level of the next question',
  })
  difficulty: string;

  @ApiProperty({
    example: "React's optimization techniques",
    description: 'Topic focus area for the next question',
  })
  focusArea: string;
}

export class ProcessInterviewResponseDto {
  @ApiProperty({
    type: EvaluationDto,
  })
  evaluation: EvaluationDto;

  @ApiProperty({
    type: NextQuestionDto,
  })
  nextQuestion: NextQuestionDto;
}
