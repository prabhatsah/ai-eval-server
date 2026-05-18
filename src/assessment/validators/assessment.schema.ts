import { z } from 'zod';

/* =========================
   MCQ
========================= */

export const McqQuestionSchema = z.object({
  question: z.string(),
  skill: z.string(),
  options: z.array(z.string()).min(4).max(4),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

/* =========================
   Coding
========================= */

export const CodingQuestionSchema = z.object({
  title: z.string(),
  problem: z.string(),
  constraints: z.string().optional(),
  sampleInput: z.string().optional(),
  sampleOutput: z.string().optional(),
  expectedApproach: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

/* =========================
  Assessment
========================= */

export const AssessmentGenerationSchema = z.object({
  mcqs: z.array(McqQuestionSchema),

  codingQuestions: z.array(CodingQuestionSchema),
});

export type AssessmentGenerationInput = z.infer<
  typeof AssessmentGenerationSchema
>;
