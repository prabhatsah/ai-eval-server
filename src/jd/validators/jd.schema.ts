import { z } from 'zod';

export const JobDescriptionSchema = z.object({
  rawText: z.string().optional(),

  role: z.string(),
  primarySkills: z.array(z.string()).min(1),

  secondarySkills: z.array(z.string()).optional(),

  experienceYears: z.number().optional(),

  difficulty: z.enum(['easy', 'medium', 'hard']),

  focusAreas: z.array(z.string()).optional(),
});

export const CreateJdSchema = z.object({
  jd: z.string().min(10),
});

export type JobDescriptionInput = z.infer<typeof JobDescriptionSchema>;
export type CreateJdInput = z.infer<typeof CreateJdSchema>;
