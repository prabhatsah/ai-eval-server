// validators/resume.schema.ts

import { z } from 'zod';

export const ResumeSchema = z.object({
  currentRole: z.string(),
  experienceYears: z.number(),
  skills: z.array(z.string()),
});

export type ResumeInput = z.infer<typeof ResumeSchema>;
