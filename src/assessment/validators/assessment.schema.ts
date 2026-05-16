import { z } from 'zod';

/* =========================
   MCQ
========================= */

export const McqSchema = z.object({
  question: z.string(),
  skill: z.string().optional(),
  options: z.array(z.string()).min(2),
  correctAnswer: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  explanation: z.string().optional(),
});

/* =========================
   Coding
========================= */

export const CodingSchema = z.object({
  title: z.string(),
  problem: z.string(),
  constraints: z.string().optional(),
  sampleInput: z.string().optional(),
  sampleOutput: z.string().optional(),
  expectedApproach: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

/* =========================
   Stored Assessment
========================= */

export const AssessmentSchema = z.object({
  id: z.string(),
  jd: z.object({
    role: z.string(),
    primarySkills: z.array(z.string()),
    secondarySkills: z.array(z.string()).optional(),
    experienceYears: z.number().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    mcqCount: z.number(),
    codingCount: z.number(),
    focusAreas: z.array(z.string()).optional(),
  }),
  assessment: z.object({
    mcqs: z.array(McqSchema),
    coding: z.array(CodingSchema),
  }),
  createdAt: z.string(),
});

export type AssessmentEntity = z.infer<typeof AssessmentSchema>;
