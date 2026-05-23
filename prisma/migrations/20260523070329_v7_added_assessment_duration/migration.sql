/*
  Warnings:

  - The values [easy,medium,hard] on the enum `Difficulty` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Difficulty_new" AS ENUM ('EASY', 'MEDIUM', 'HARD');
ALTER TABLE "JobDescription" ALTER COLUMN "difficulty" TYPE "Difficulty_new" USING ("difficulty"::text::"Difficulty_new");
ALTER TABLE "Assessment" ALTER COLUMN "difficulty" TYPE "Difficulty_new" USING ("difficulty"::text::"Difficulty_new");
ALTER TABLE "McqQuestion" ALTER COLUMN "difficulty" TYPE "Difficulty_new" USING ("difficulty"::text::"Difficulty_new");
ALTER TABLE "CodingQuestion" ALTER COLUMN "difficulty" TYPE "Difficulty_new" USING ("difficulty"::text::"Difficulty_new");
ALTER TYPE "Difficulty" RENAME TO "Difficulty_old";
ALTER TYPE "Difficulty_new" RENAME TO "Difficulty";
DROP TYPE "public"."Difficulty_old";
COMMIT;

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "durationMinutes" INTEGER;
