import { z } from 'zod';

// SectionType
export const SectionTypeSchema = z.enum(['AI', 'MCQ', 'CODING']);

// SectionConfig
export const SectionConfigSchema = z.object({
  weight: z.number().min(0).max(1),
});

// EvaluationConfig
export const EvaluationConfigSchema = z.object({
  sections: z.record(SectionTypeSchema, SectionConfigSchema),
  passingScore: z.number().min(0).max(100),
});

export const EvaluationSchema = z.object({
  id: z.string(),
  title: z.string(),
  skill: z.string(),
  config: EvaluationConfigSchema,
  createdBy: z.string(),
  createdAt: z.date(),
});

// Type inference (optional)
export type EvaluationConfig = z.infer<typeof EvaluationConfigSchema>;
export type SectionConfig = z.infer<typeof SectionConfigSchema>;
export type SectionType = z.infer<typeof SectionTypeSchema>;
export type EvaluationType = z.infer<typeof EvaluationSchema>;
