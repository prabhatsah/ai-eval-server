/*
  Warnings:

  - A unique constraint covering the columns `[assessmentCode]` on the table `Assessment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assessmentCode` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "assessmentCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_assessmentCode_key" ON "Assessment"("assessmentCode");
