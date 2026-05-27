import { ZodType } from 'zod';

export function parseJsonSafely<T>(raw: string, schema: ZodType<T>): T {
  try {
    let cleaned = raw.trim();

    // Remove markdown code fences only if entire response is fenced
    cleaned = cleaned
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '');

    // Attempt direct parse first
    try {
      const parsed = JSON.parse(cleaned);

      return schema.parse(parsed);
    } catch {}

    // Fallback: extract largest JSON object
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON object found');
    }

    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned);

    return schema.parse(parsed);
  } catch (error: any) {
    // console.error('\n===== RAW LLM RESPONSE =====\n');
    // console.error(raw);

    // console.error('\n===== ERROR =====\n');
    // console.error(error);

    // Important:
    // surface zod errors too
    if (error?.issues) {
      // console.error('\n===== ZOD ISSUES =====\n');
      // console.dir(error.issues, { depth: null });
    }

    throw error;
  }
}
