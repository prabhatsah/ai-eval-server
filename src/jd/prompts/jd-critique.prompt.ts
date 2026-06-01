// prompts/jd-critique.prompt.ts

import { JobDescriptionInput } from '../validators/jd.schema';

export const buildJdCritiquePrompt = (
  jd: string,
  parsed: JobDescriptionInput,
): string => `
You are a strict AI evaluator responsible for validating structured hiring data extracted from a Job Description (JD).

Your task is to critically evaluate the extracted JSON against the raw JD.

You must detect:
- incorrect role extraction
- missing important skills
- irrelevant skills
- hallucinated information
- incorrect experience extraction
- incorrect difficulty mapping
- weak focus areas
- incomplete extraction
- poor normalization
- schema quality issues

---

EVALUATION RULES

ROLE:
- Must accurately represent the actual hiring role
- Must be normalized to industry-standard naming

PRIMARY SKILLS:
- Must contain core mandatory technical skills
- Must NOT include soft skills
- Must NOT contain irrelevant technologies

SECONDARY SKILLS:
- Must include optional/nice-to-have technologies
- Should not duplicate primary skills

EXPERIENCE:
- Must match JD requirements
- If inferred, inference should be reasonable

DIFFICULTY:
- Must align with experienceYears
- Mapping:
  0–2 → EASY
  2–5 → MEDIUM
  5+ → HARD

FOCUS AREAS:
- Must align with responsibilities in JD
- Must be technically meaningful

---

SCORING RUBRIC

9–10:
- Excellent extraction
- Accurate and complete
- No major issues

7–8:
- Mostly correct
- Minor issues allowed

5–6:
- Moderate issues
- Missing or partially incorrect fields

0–4:
- Poor extraction
- Major hallucinations or missing data

---

PASSING CONDITION

- passed = true ONLY if:
  - score >= 8
  - no major hallucinations
  - extraction is usable for assessment generation

---

IMPORTANT RULES

- Be strict and deterministic
- Do NOT be lenient
- Return ONLY JSON
- Do NOT include markdown
- Do NOT include explanations outside JSON
- feedback must be actionable
- issues must clearly identify problems
- suggestedImprovements must contain concrete fixes

---

OUTPUT FORMAT

{
  "score": number,
  "passed": boolean,
  "feedback": ["string"],
  "issues": ["string"],
  "suggestedImprovements": ["string"]
}

---

RAW JOB DESCRIPTION

${jd}

---

EXTRACTED JSON

${JSON.stringify(parsed, null, 2)}
`;
