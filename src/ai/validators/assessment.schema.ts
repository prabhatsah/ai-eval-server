import { z } from 'zod';

/* =========================
   MCQ Schema
========================= */

export const McqSchema = z.object({
  question: z.string(),
  skill: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  explanation: z.string(),
});

/* =========================
   Coding Schema
========================= */

export const CodingSchema = z.object({
  title: z.string(),
  problem: z.string(),
  constraints: z.string(),
  sampleInput: z.string(),
  sampleOutput: z.string(),
  expectedApproach: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

/* =========================
   Final Response Schema
========================= */

export const AssessmentResultSchema = z.object({
  mcqs: z.array(McqSchema).min(0),
  coding: z.array(CodingSchema).min(0),
});

/* =========================
   Input Schema
========================= */

export const AssessmentInputSchema = z.object({
  role: z.string(),

  primarySkills: z.array(z.string()).min(1),

  secondarySkills: z.array(z.string()).optional(),

  experienceYears: z.number().optional(),

  difficulty: z.enum(['easy', 'medium', 'hard']),

  mcqCount: z.number().min(1).max(20).default(10),

  codingCount: z.number().min(0).max(5).default(1),

  focusAreas: z.array(z.string()).optional(),
});

/* =========================
   Types (Derived)
========================= */

export type AssessmentInput = z.infer<typeof AssessmentInputSchema>;
export type AssessmentResult = z.infer<typeof AssessmentResultSchema>;
export type Mcq = z.infer<typeof McqSchema>;
export type Coding = z.infer<typeof CodingSchema>;
``;
