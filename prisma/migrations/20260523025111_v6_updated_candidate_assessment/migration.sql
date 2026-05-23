/*
  Warnings:

  - You are about to drop the column `answer` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `attemptId` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the `Attempt` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `candidateAssessmentId` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CandidateAssessmentStatus" AS ENUM ('ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'EVALUATED', 'EXPIRED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "Attempt" DROP CONSTRAINT "Attempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_attemptId_fkey";

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "answer",
DROP COLUMN "attemptId",
DROP COLUMN "feedback",
DROP COLUMN "question",
DROP COLUMN "type",
ADD COLUMN     "aiFeedback" TEXT,
ADD COLUMN     "candidateAssessmentId" TEXT NOT NULL,
ADD COLUMN     "codingAnswer" TEXT,
ADD COLUMN     "codingQuestionId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isCorrect" BOOLEAN,
ADD COLUMN     "mcqQuestionId" TEXT,
ADD COLUMN     "selectedOption" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Attempt";

-- CreateTable
CREATE TABLE "CandidateAssessment" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "status" "CandidateAssessmentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "mcqScore" DOUBLE PRECISION,
    "codingScore" DOUBLE PRECISION,
    "aiScore" DOUBLE PRECISION,
    "finalScore" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "evaluatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "evaluationSummary" TEXT,
    "feedback" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "evaluationId" TEXT,

    CONSTRAINT "CandidateAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CandidateAssessment_candidateId_idx" ON "CandidateAssessment"("candidateId");

-- CreateIndex
CREATE INDEX "CandidateAssessment_assessmentId_idx" ON "CandidateAssessment"("assessmentId");

-- CreateIndex
CREATE INDEX "CandidateAssessment_status_idx" ON "CandidateAssessment"("status");

-- CreateIndex
CREATE INDEX "CandidateAssessment_finalScore_idx" ON "CandidateAssessment"("finalScore");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateAssessment_candidateId_assessmentId_key" ON "CandidateAssessment"("candidateId", "assessmentId");

-- CreateIndex
CREATE INDEX "Response_candidateAssessmentId_idx" ON "Response"("candidateAssessmentId");

-- CreateIndex
CREATE INDEX "Response_mcqQuestionId_idx" ON "Response"("mcqQuestionId");

-- CreateIndex
CREATE INDEX "Response_codingQuestionId_idx" ON "Response"("codingQuestionId");

-- AddForeignKey
ALTER TABLE "CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_candidateAssessmentId_fkey" FOREIGN KEY ("candidateAssessmentId") REFERENCES "CandidateAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
