/*
  Warnings:

  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CandidateAssessment" DROP CONSTRAINT "CandidateAssessment_evaluationId_fkey";

-- AlterTable
ALTER TABLE "CandidateAssessment" ADD COLUMN     "skillBreakdown" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "overallAssessmentScore" DOUBLE PRECISION,
ADD COLUMN     "overallSkillScores" JSONB;

-- DropTable
DROP TABLE "Evaluation";
