import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;

  // constructor() {
  //   this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  // }

  async generate(prompt: string, apiKey: string): Promise<string> {
    try {
      console.log('apiKey:', apiKey);

      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const result = await model.generateContent(prompt);

      const response = result.response;

      return response.text();
    } catch (error) {
      console.error('Gemini Error:', error);
      throw new Error('Failed to call Gemini API');
    }
  }
}
