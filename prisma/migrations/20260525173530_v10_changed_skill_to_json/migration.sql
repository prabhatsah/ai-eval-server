/*
  Warnings:

  - You are about to drop the column `skill` on the `McqQuestion` table. All the data in the column will be lost.
  - Added the required column `skills` to the `McqQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "McqQuestion_skill_idx";

-- AlterTable
ALTER TABLE "McqQuestion" DROP COLUMN "skill",
ADD COLUMN     "skills" JSONB NOT NULL;
