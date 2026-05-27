import { Difficulty } from '@prisma/client';
import { z } from 'zod';

/* =========================
   MCQ
========================= */

export const McqQuestionSchema = z.object({
  question: z.string(),
  skills: z.array(z.string()),
  options: z.array(z.string()).length(4),

  // 0 -> option[0]
  // 1 -> option[1]
  // etc
  correctAnswerIndex: z.number().int().min(0).max(3),
  explanation: z.string().optional(),
  difficulty: z.enum(Difficulty),
});

/* =========================
   Hidden Test Case
========================= */

export const TestCaseSchema = z.object({
  input: z.string(),
  output: z.string(),
});

/* =========================
   Coding
========================= */
export const CodingQuestionSchema = z.object({
  title: z.string(),

  problem: z.string(),

  constraints: z.string().optional(),

  sampleCases: z.array(TestCaseSchema).min(2),

  expectedApproach: z.string().optional(),

  timeComplexity: z.string().optional(),

  spaceComplexity: z.string().optional(),

  hiddenTestCases: z.array(TestCaseSchema).min(1),

  difficulty: z.enum(Difficulty),
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
