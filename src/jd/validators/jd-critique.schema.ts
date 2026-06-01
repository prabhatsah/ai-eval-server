import { z } from 'zod';

export const JdCritiqueSchema = z.object({
  score: z.number().min(0).max(10),
  passed: z.boolean(),
  feedback: z.array(z.string()).min(1),
  issues: z.array(z.string()).default([]),
  suggestedImprovements: z.array(z.string()).default([]),
});

export type JdCritiqueInput = z.infer<typeof JdCritiqueSchema>;
