/*
  Warnings:

  - Added the required column `createdId` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `CandidateAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdId` to the `JobDescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "createdId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CandidateAssessment" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobDescription" ADD COLUMN     "createdId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "JobDescription" ADD CONSTRAINT "JobDescription_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
