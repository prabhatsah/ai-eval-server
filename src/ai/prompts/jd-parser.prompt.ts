export const buildJdParsingPrompt = (jd: string): string => `
You are an expert technical recruiter and hiring assessment designer.

Your task is to analyze the given Job Description (JD) and extract structured hiring information.

You must infer and normalize hiring signals into a clean, consistent format usable for automated assessment generation.

---

OBJECTIVE

Extract the following:

- Role
- Primary skills (core must-have skills)
- Secondary skills (nice-to-have skills)
- Experience in years
- Difficulty level
- Focus areas for assessment

---

EXTRACTION RULES

ROLE:
- Normalize role to industry standard titles
- Example:
  "Software Engineer II" → "Backend Engineer"
  "Full Stack Developer" → "Full Stack Engineer"

PRIMARY SKILLS:
- Identify 3–5 core mandatory skills
- Must directly relate to daily job responsibilities
- Avoid soft skills (e.g., communication, teamwork)

SECONDARY SKILLS:
- Extract optional or good-to-have skills
- Tools, frameworks, cloud, infra, etc.

SKILL NORMALIZATION:
- Merge similar terms:
  "Node" → "Node.js"
  "Postgres" → "PostgreSQL"
- Remove duplicates

EXPERIENCE:
- Extract numeric years from JD if present
- Examples:
  "3+ years" → 3
  "2–5 years" → 3
- If missing, assume 3 (medium level)

DIFFICULTY MAPPING:
- Based on experienceYears:
  0–2 → easy
  2–5 → medium
  5+ → hard

FOCUS AREAS:
- Infer 1–3 key areas based on responsibilities
- Examples:
  API development, system design, performance optimization, database design

DEFAULTS:
- mcqCount = 10
- codingCount = 1

---

IMPORTANT RULES

- Infer intelligently when data is missing
- Do NOT leave required fields empty
- Ensure at least 3 primary skills are returned
- Ensure output is structured and clean
- Do NOT include explanations
- Do NOT include any text outside JSON

---

OUTPUT FORMAT (STRICT JSON ONLY)

{
  "role": "string",
  "primarySkills": ["string"],
  "secondarySkills": ["string"],
  "experienceYears": number,
  "difficulty": "easy|medium|hard",
  "mcqCount": number,
  "codingCount": number,
  "focusAreas": ["string"]
}

---

JOB DESCRIPTION:

${jd}
`;
