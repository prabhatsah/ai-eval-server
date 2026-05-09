export interface AssessmentPromptInput {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mcqCount: number;
  codingCount: number;
}

export const buildAssessmentPrompt = (input: AssessmentPromptInput): string => {
  return `
You are a senior technical assessment designer.

Your task is to generate professional employee assessments.

Generate:
1. MCQ questions
2. Coding challenges

Rules:
- Questions must be practical and industry-level
- Avoid theoretical trivia
- Questions should test real understanding
- Coding problems should test problem-solving ability
- Difficulty must match requested level
- Return ONLY valid JSON
- No markdown
- No explanations outside JSON

JSON FORMAT:
{
  "mcqs": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "string",
      "difficulty": "easy|medium|hard",
      "explanation": "string"
    }
  ],
  "coding": [
    {
      "title": "string",
      "problem": "string",
      "constraints": "string",
      "sampleInput": "string",
      "sampleOutput": "string",
      "expectedApproach": "string",
      "difficulty": "easy|medium|hard"
    }
  ]
}

INPUT:
Topic: ${input.topic}
Difficulty: ${input.difficulty}
MCQ Count: ${input.mcqCount}
Coding Count: ${input.codingCount}
`;
};
