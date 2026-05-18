interface BuildAssessmentPromptParams {
  role: string;
  primarySkills: string[];
  secondarySkills?: string[];
  experienceYears?: number;
  difficulty: string;
  focusAreas?: string[];
  mcqCount: number;
  codingCount: number;
}

export const buildAssessmentPrompt = (data: BuildAssessmentPromptParams) => `
You are a senior technical interviewer and assessment designer.

Your task is to generate HIGH QUALITY technical assessment questions.

---

ROLE

${data.role}

---

PRIMARY SKILLS

${data.primarySkills.join(', ')}

---

SECONDARY SKILLS

${data.secondarySkills?.join(', ') || 'None'}

---

EXPERIENCE

${data.experienceYears || 3} years

---

DIFFICULTY

${data.difficulty}

---

FOCUS AREAS

${data.focusAreas?.join(', ') || 'General'}

---

TASK

Generate:

- ${data.mcqCount} MCQ questions
- ${data.codingCount} coding questions

---

MCQ RULES

- Technical only
- Avoid trivia
- Focus on practical engineering knowledge
- 4 options exactly
- One correct answer
- Include explanation
- Questions should test reasoning

---

CODING QUESTION RULES

- Real-world interview quality
- Clear problem statement
- Include constraints
- Include sample input/output
- Include expected approach
- Avoid impossible competitive programming problems

---

IMPORTANT

- Return ONLY JSON
- No markdown
- No explanations outside JSON
- Ensure valid JSON

---

OUTPUT FORMAT

{
  "mcqs": [
    {
      "question": "string",
      "skill": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "string",
      "difficulty": "easy|medium|hard",
      "explanation": "string"
    }
  ],
  "codingQuestions": [
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
`;
