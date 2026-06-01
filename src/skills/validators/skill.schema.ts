import { z } from 'zod';

export const SkillSchema = z.string().trim().min(1);

export const SkillsArraySchema = z.array(SkillSchema);
