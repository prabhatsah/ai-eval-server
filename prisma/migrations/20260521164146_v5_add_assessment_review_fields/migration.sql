-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'NEEDS_REVISION', 'REJECTED', 'REVIEW_FAILED');

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "reviewIssues" JSONB,
ADD COLUMN     "reviewRecommendation" TEXT,
ADD COLUMN     "reviewScore" INTEGER,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "status" "AssessmentStatus" NOT NULL DEFAULT 'PENDING_REVIEW';

-- CreateIndex
CREATE INDEX "Assessment_status_idx" ON "Assessment"("status");

-- CreateIndex
CREATE INDEX "Assessment_reviewScore_idx" ON "Assessment"("reviewScore");
