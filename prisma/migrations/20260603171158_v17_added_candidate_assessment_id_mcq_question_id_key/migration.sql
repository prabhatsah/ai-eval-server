/*
  Warnings:

  - A unique constraint covering the columns `[candidateAssessmentId,mcqQuestionId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Response_candidateAssessmentId_mcqQuestionId_key" ON "Response"("candidateAssessmentId", "mcqQuestionId");
