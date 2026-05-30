import { z } from 'zod';

// OVERVIEW
export const AssessmentAssignmentOverviewSchema = z.object({
  assessmentId: z.uuid(),
  role: z.string(),
  difficulty: z.string(),
  totalAssigned: z.number(),
  completed: z.number(),
  inProgress: z.number(),
  expired: z.number(),
  averageScore: z.number(),
});

export type AssessmentAssignmentOverview = z.infer<
  typeof AssessmentAssignmentOverviewSchema
>;

//////////////////////////////////////////////////////
// CANDIDATES BY ASSESSMENT
//////////////////////////////////////////////////////

export const CandidateByAssessmentSchema = z.object({
  candidateAssessmentId: z.uuid(),
  candidateId: z.uuid(),
  candidateName: z.string(),
  candidateEmail: z.email(),
  status: z.string(),
  score: z.number().nullable(),
  startedAt: z.date().nullable(),
  submittedAt: z.date().nullable(),
});

export type CandidateByAssessment = z.infer<typeof CandidateByAssessmentSchema>;

//////////////////////////////////////////////////////
// DETAILED RESULT
//////////////////////////////////////////////////////

export const CandidateDetailedResultSchema = z.object({
  candidateAssessmentId: z.uuid(),
  candidateName: z.string(),
  candidateEmail: z.email(),
  assessment: z.object({
    id: z.uuid(),
    role: z.string(),
    difficulty: z.string(),
  }),
  score: z.number().nullable(),
  skillBreakdown: z.record(z.string(), z.number()),
  responses: z.array(
    z.object({
      question: z.string(),
      selectedOption: z.string(),
      correctAnswer: z.string(),
      isCorrect: z.boolean(),
      explanation: z.string().nullable(),
    }),
  ),
});

export type CandidateDetailedResult = z.infer<
  typeof CandidateDetailedResultSchema
>;
