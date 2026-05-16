import { z } from 'zod';

export const userIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type UserIdParam = z.infer<typeof userIdParamSchema>;
``;
