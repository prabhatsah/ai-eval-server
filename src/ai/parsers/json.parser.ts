import { z, ZodType } from 'zod';

export function parseJsonSafely<T>(raw: string, schema: ZodType<T>): T {
  try {
    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    return schema.parse(parsed); //
  } catch (error) {
    throw new Error('Invalid JSON or schema mismatch');
  }
}
