import { z } from 'zod';

export const SubmitAssessmentSchema = z.object({
  candidateAssessmentId: z.uuid(),
});

export type SubmitAssessmentInput = z.infer<typeof SubmitAssessmentSchema>;
