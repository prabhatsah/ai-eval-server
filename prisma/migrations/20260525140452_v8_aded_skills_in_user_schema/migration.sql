-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentRole" TEXT,
ADD COLUMN     "experienceYears" DOUBLE PRECISION,
ADD COLUMN     "skills" JSONB;
