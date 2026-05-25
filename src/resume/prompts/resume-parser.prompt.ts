// prompts/resume-parser.prompt.ts

export const buildResumePrompt = (text: string) => `
You are an expert resume parser.

Extract structured candidate information.

IMPORTANT:
- Return ONLY valid JSON
- No markdown
- No explanations

OUTPUT FORMAT:

{
  "currentRole": "string",
  "experienceYears": number,
  "skills": ["string"]
}

RESUME:

${text}
`;
