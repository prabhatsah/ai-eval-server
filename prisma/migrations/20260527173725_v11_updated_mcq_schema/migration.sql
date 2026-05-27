/*
  Warnings:

  - You are about to drop the column `correctAnswer` on the `McqQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `selectedOption` on the `Response` table. All the data in the column will be lost.
  - Added the required column `correctAnswerIndex` to the `McqQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "McqQuestion" DROP COLUMN "correctAnswer",
ADD COLUMN     "correctAnswerIndex" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "selectedOption",
ADD COLUMN     "selectedOptionIndex" INTEGER;
