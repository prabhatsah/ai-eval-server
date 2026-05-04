import { z } from 'zod';

export const QuestionTypeSchema = z.enum(['MCQ', 'CODING', 'AI']);

export const StartAttemptSchema = z.object({
  evaluationId: z.string().min(1, 'Evaluation ID is required'),
});

export type StartAttempt = z.infer<typeof StartAttemptSchema>;

export const SubmitAnswerSchema = z.object({
  attemptId: z.string().min(1, 'Attempt ID is required'),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  type: QuestionTypeSchema,
});

export type SubmitAnswer = z.infer<typeof SubmitAnswerSchema>;
