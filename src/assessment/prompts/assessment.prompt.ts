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
- Questions should test reasoning
- Exactly 4 options
- One correct answer
- Include explanation

IMPORTANT FORMAT RULES

- options must contain ONLY raw option text
- DO NOT prefix options with:
  - A.
  - B.
  - C.
  - D.
  - numbers
  - bullets
- correctAnswerIndex must be:
  - a zero-based index
  - a number between 0 and 3
  - matching the correct option
- Do NOT include a correctAnswer string field
- Do NOT label options in any way
- Return clean plain strings only

GOOD EXAMPLE

{
  "question": "Which HTTP status code is commonly used for unauthorized requests?",
  "options": [
    "200",
    "401",
    "500",
    "301"
  ],
  "correctAnswerIndex": 1
}

BAD EXAMPLE

{
  "options": [
    "A. 200",
    "B. 401"
  ],
  "correctAnswer": "B. 401"
}

---

CODING QUESTION RULES

IMPORTANT:

Coding questions MUST be algorithmic/programming problems similar to:
- LeetCode
- HackerRank
- CodeSignal

The candidate should solve them by writing executable code in languages like:
- Python
- Java
- JavaScript
- TypeScript
- C++
- C
- Go

STRICTLY AVOID:
- SQL query writing
- Database-only problems
- React/UI implementation tasks
- HTML/CSS tasks
- System design questions
- Architecture discussions
- DevOps tasks
- API design tasks
- Framework-specific coding
- Non-executable theoretical questions

If a skill is frontend, backend, database, cloud, DevOps, or framework-related,
convert it into a pure programming/problem-solving question instead of a framework implementation task.

Coding problems MUST:
- Produce deterministic output
- Be solvable via standard input/output
- Support automated evaluation with hidden test cases
- Focus on problem-solving and coding logic
- Be language agnostic
- Include edge cases
- Be realistic interview quality

Each coding question should contain:
- Title
- Detailed problem statement
- Constraints
- At least 2 sample test cases
- Each sample test case must contain:
  - input
  - output
- Expected approach
- Time complexity expectation
- Space complexity expectation
- Hidden test cases

The problems should resemble:
- Arrays
- Strings
- Hash maps
- Sliding window
- Stack/Queue
- Recursion
- Trees/Graphs
- Dynamic programming
- Searching/Sorting
- Greedy algorithms
- Two pointers
- Simulation
- Parsing
- Basic data structures

Difficulty should match:
- EASY → beginner friendly
- MEDIUM → standard interview level
- HARD → strong DSA/problem solving required
- Do NOT return sampleInput
- Do NOT return sampleOutput
- Use sampleCases only
---

IMPORTANT

- Return ONLY JSON
- No markdown
- No explanations outside JSON
- Ensure valid JSON
- Do not wrap JSON in code blocks


---

OUTPUT FORMAT

{
  "mcqs": [
    {
      "question": "string",
      "skills": ["Node.js", "TypeScript"],
      "options": [
        "string",
        "string",
        "string",
        "string"
      ],
      "correctAnswerIndex": 0,
      "difficulty": "EASY|MEDIUM|HARD",
      "explanation": "string"
    }
  ],
  "codingQuestions": [
    {
      "title": "string",
      "problem": "string",
      "constraints": "string",
      "sampleCases": [
        {
          "input": "string",
          "output": "string"
        },
        {
          "input": "string",
          "output": "string"
        }
      ],
      "expectedApproach": "string",
      "timeComplexity": "string",
      "spaceComplexity": "string",
      "difficulty": "EASY|MEDIUM|HARD",
      "hiddenTestCases": [
        {
          "input": "string",
          "output": "string"
        }
      ]
    }
  ]
}
`;
