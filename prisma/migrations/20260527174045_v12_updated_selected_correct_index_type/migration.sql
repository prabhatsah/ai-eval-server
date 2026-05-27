/*
  Warnings:

  - Changed the type of `correctAnswerIndex` on the `McqQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "McqQuestion" DROP COLUMN "correctAnswerIndex",
ADD COLUMN     "correctAnswerIndex" INTEGER NOT NULL;
