import { ZodType } from 'zod';

export function parseJsonSafely<T>(raw: string, schema: ZodType<T>): T {
  let cleaned;

  try {
    cleaned = raw;

    // Remove markdown variants
    cleaned = cleaned.replace(/```[\s\S]*?```/g, (match) =>
      match.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, ''),
    );

    // Extract only JSON between first { and last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON found in response');
    }

    cleaned = cleaned.substring(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned);

    return schema.parse(parsed);
  } catch (error: any) {
    console.error('RAW RESPONSE:', raw);
    console.error('CLEANED:', cleaned);

    throw new Error(`Invalid JSON or schema mismatch: ${error.message}`);
  }
}
