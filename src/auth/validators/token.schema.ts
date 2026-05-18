import { Role } from "@prisma/client";
import { z } from "zod";

export const AccessTokenSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(Role),
  name: z.string().min(1),
  email: z.string().email(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type AccessTokenPayload = z.infer<typeof AccessTokenSchema>;

export const RefreshTokenSchema = z.object({
  userId: z.string().min(1),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type RefreshTokenPayload = z.infer<typeof RefreshTokenSchema>;