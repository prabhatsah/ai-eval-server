import { z } from 'zod';

export const EvaluateMcqSchema = z.object({
  candidateAssessmentId: z.uuid(),

  answers: z.array(
    z.object({
      mcqQuestionId: z.uuid(),

      selectedOption: z.string(),
    }),
  ),
});

export type EvaluateMcqInput = z.infer<typeof EvaluateMcqSchema>;
