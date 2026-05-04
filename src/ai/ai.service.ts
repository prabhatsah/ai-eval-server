import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AiEvaluationResult } from './types/ai-response.type';

@Injectable()
export class AiService {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async evaluateAnswer(
    question: string,
    answer: string,
  ): Promise<AiEvaluationResult> {
    const prompt = `
You are a strict technical evaluator.

Evaluate:
Question: ${question}
Answer: ${answer}

Return ONLY JSON:
{
  "score": number (0-10),
  "feedback": "string"
}
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content;

    try {
      return JSON.parse(text || '{}') as AiEvaluationResult;
    } catch {
      return { score: 0, feedback: 'Invalid AI response' };
    }
  }
}
