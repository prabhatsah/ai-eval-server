/*
  Warnings:

  - A unique constraint covering the columns `[candidateAssessmentId,codingQuestionId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Response_candidateAssessmentId_codingQuestionId_key" ON "Response"("candidateAssessmentId", "codingQuestionId");
