import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly baseUrl = 'http://localhost:11434';

  async generate(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen2.5:7b',
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to call Ollama');
    }

    const data = await response.json();

    return data.response;
  }
}
