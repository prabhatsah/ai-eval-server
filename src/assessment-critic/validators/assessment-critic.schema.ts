import { z } from 'zod';

export const CriticIssueSchema = z.object({
  severity: z.enum(['low', 'medium', 'high']),
  message: z.string(),
});

export const AssessmentCriticSchema = z.object({
  overallQualityScore: z.number().min(0).max(100),
  relevanceScore: z.number().min(0).max(100),
  difficultyAlignmentScore: z.number().min(0).max(100),
  clarityScore: z.number().min(0).max(100),
  practicalityScore: z.number().min(0).max(100),
  duplicateQuestionScore: z.number().min(0).max(100),
  issues: z.array(CriticIssueSchema),
  recommendation: z.enum(['approved', 'revise', 'rejected']),
});

export type AssessmentCriticInput = z.infer<typeof AssessmentCriticSchema>;
