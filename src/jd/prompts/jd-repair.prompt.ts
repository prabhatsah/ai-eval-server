// prompts/jd-repair.prompt.ts

import { JobDescriptionInput } from '../validators/jd.schema';
import { JdCritiqueInput } from '../validators/jd-critique.schema';

export const buildJdRepairPrompt = (
  jd: string,
  previousOutput: JobDescriptionInput,
  critique: JdCritiqueInput,
): string => `
You are an expert technical recruiter and hiring assessment designer.

Your previous extraction output failed evaluation.

You must regenerate the extraction by fixing all issues identified in the critique.

Your goal is to produce a higher-quality structured extraction from the JD.

---

STRICT REQUIREMENTS

- Fix ALL critique issues
- Preserve fields that are already correct
- Improve incorrect or weak fields
- Remove hallucinated skills or technologies
- Ensure skills are technically accurate
- Ensure role normalization is correct
- Ensure difficulty aligns with experienceYears
- Ensure focus areas are meaningful
- Ensure output is assessment-ready
- Return STRICT JSON ONLY
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include extra text

---

EXTRACTION REQUIREMENTS

ROLE:
- Normalize to industry-standard titles

PRIMARY SKILLS:
- Extract 3–5 mandatory technical skills
- Avoid soft skills

SECONDARY SKILLS:
- Extract optional/nice-to-have technologies

EXPERIENCE:
- Extract numeric years
- Infer reasonably if missing

DIFFICULTY:
- 0–2 → EASY
- 2–5 → MEDIUM
- 5+ → HARD

FOCUS AREAS:
- Infer 1–3 meaningful technical focus areas

DEFAULTS:
- mcqCount = 10
- codingCount = 1

---

CRITIQUE SCORE

${critique.score}

---

FEEDBACK

${critique.feedback.map((item) => `- ${item}`).join('\n')}

---

ISSUES IDENTIFIED

${critique.issues.map((item) => `- ${item}`).join('\n')}

---

SUGGESTED IMPROVEMENTS

${critique.suggestedImprovements.map((item) => `- ${item}`).join('\n')}

---

PREVIOUS OUTPUT

${JSON.stringify(previousOutput, null, 2)}

---

RAW JOB DESCRIPTION

${jd}

---

OUTPUT FORMAT

{
  "role": "string",
  "primarySkills": ["string"],
  "secondarySkills": ["string"],
  "experienceYears": number,
  "difficulty": "EASY|MEDIUM|HARD",
  "mcqCount": number,
  "codingCount": number,
  "focusAreas": ["string"]
}
`;
