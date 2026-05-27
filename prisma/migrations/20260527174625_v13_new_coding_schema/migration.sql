/*
  Warnings:

  - You are about to drop the column `sampleInput` on the `CodingQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `sampleOutput` on the `CodingQuestion` table. All the data in the column will be lost.
  - Added the required column `hiddenTestCases` to the `CodingQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sampleCases` to the `CodingQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CodingQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CodingQuestion" DROP CONSTRAINT "CodingQuestion_assessmentId_fkey";

-- DropIndex
DROP INDEX "CodingQuestion_assessmentId_idx";

-- AlterTable
ALTER TABLE "CodingQuestion" DROP COLUMN "sampleInput",
DROP COLUMN "sampleOutput",
ADD COLUMN     "hiddenTestCases" JSONB NOT NULL,
ADD COLUMN     "sampleCases" JSONB NOT NULL,
ADD COLUMN     "spaceComplexity" TEXT,
ADD COLUMN     "timeComplexity" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "assessmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CodingQuestion" ADD CONSTRAINT "CodingQuestion_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
