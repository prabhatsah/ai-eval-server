import { AssessmentInput } from "../validators/assessment.schema";

export const buildAssessmentPrompt = (input: AssessmentInput): string => {
  return `
You are a senior technical assessment designer.

Your task is to generate a high-quality professional assessment for hiring.

The assessment must be aligned with:
- Role
- Candidate experience
- Primary skills
- Real-world use cases

---

ASSESSMENT REQUIREMENTS

Generate:
1. MCQ questions (${input.mcqCount})
2. Coding challenges (${input.codingCount})

---

QUESTION DESIGN RULES

- Questions must be practical, scenario-based, and industry-level
- Avoid theoretical or definition-based questions
- Test problem-solving, debugging, and decision-making ability
- Do NOT repeat the same concept across questions
- Ensure coverage across ALL primary skills
- Prefer real-world situations (APIs, debugging, performance, design)

---

SKILL DISTRIBUTION

- Distribute MCQs evenly across primarySkills
- Use secondarySkills occasionally for mixed or advanced questions
- Use focusAreas (if provided) to bias question scenarios

---

CODING QUESTION RULES

- Must reflect real job tasks for the role
- Avoid trivial problems (e.g., reversing strings)
- Should involve realistic backend/frontend/system scenarios
- Include constraints that reflect production considerations
- Expected approach should explain thinking, not just solution

---

DIFFICULTY ADJUSTMENT

- Match difficulty strictly: ${input.difficulty}

Experience: ${input.experienceYears ?? 'Not specified'}

Guidelines:
- easy → basic implementation, small logic
- medium → multi-step logic, debugging, real-world usage
- hard → complex logic, optimization, system thinking

---

OUTPUT RULES

- Return ONLY valid JSON
- No markdown
- No explanations outside JSON
- Ensure all fields are present
- Ensure correct JSON formatting

---

JSON FORMAT:

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

---

INPUT:

Role: ${input.role}

Primary Skills:
${input.primarySkills.join(', ')}

Secondary Skills:
${input.secondarySkills?.join(', ') || 'None'}

Focus Areas:
${input.focusAreas?.join(', ') || 'None'}

MCQ Count: ${input.mcqCount}

Coding Count: ${input.codingCount}
`;
};
``;
