import { z } from 'zod';

export const AssignAssessmentSchema = z.object({
  candidateId: z.uuid(),
  assessmentId: z.uuid(),
  expiresAt: z.string().datetime().optional(),
});

export type AssignAssessmentInput = z.infer<typeof AssignAssessmentSchema>;
