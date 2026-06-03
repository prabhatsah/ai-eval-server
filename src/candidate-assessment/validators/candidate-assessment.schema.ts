import { CandidateAssessmentStatus } from '@prisma/client';
import { z } from 'zod';

export const CandidateAssessmentStatusSchema = z.enum(
  CandidateAssessmentStatus,
);

export const CandidateAssessmentSchema = z.object({
  id: z.uuid(),
  candidateId: z.uuid(),
  assessmentId: z.uuid(),
  status: CandidateAssessmentStatusSchema,
  mcqScore: z.number().nullable(),
  codingScore: z.number().nullable(),
  aiScore: z.number().nullable(),
  finalScore: z.number().nullable(),
  startedAt: z.date().nullable(),
  submittedAt: z.date().nullable(),
  evaluatedAt: z.date().nullable(),
  expiresAt: z.date().nullable(),
  evaluationSummary: z.string().nullable(),
  feedback: z.any().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CandidateAssessmentInput = z.infer<
  typeof CandidateAssessmentSchema
>;

export const SaveMcqAnswerSchema = z.object({
  candidateAssessmentId: z.uuid(),
  mcqQuestionId: z.uuid(),
  selectedOptionIndex: z.number().int().min(-1),
});

export type SaveMcqAnswerInput = z.infer<typeof SaveMcqAnswerSchema>;

export const SaveCodingAnswerSchema = z.object({
  candidateAssessmentId: z.uuid(),
  codingQuestionId: z.uuid(),
  codingAnswer: z.string().min(1),
});

export type SaveCodingAnswerInput = z.infer<typeof SaveCodingAnswerSchema>;
