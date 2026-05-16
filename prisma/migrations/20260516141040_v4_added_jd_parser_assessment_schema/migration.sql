-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateTable
CREATE TABLE "JobDescription" (
    "id" TEXT NOT NULL,
    "jdGroupId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "rawText" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "primarySkills" JSONB NOT NULL,
    "secondarySkills" JSONB,
    "experienceYears" INTEGER,
    "difficulty" "Difficulty" NOT NULL,
    "focusAreas" JSONB,
    "isLatest" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "jobDescriptionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "experienceYears" INTEGER,
    "mcqCount" INTEGER NOT NULL,
    "codingCount" INTEGER NOT NULL,
    "primarySkills" JSONB NOT NULL,
    "secondarySkills" JSONB,
    "focusAreas" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "McqQuestion" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "skill" TEXT,
    "options" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "McqQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodingQuestion" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "constraints" TEXT,
    "sampleInput" TEXT,
    "sampleOutput" TEXT,
    "expectedApproach" TEXT,
    "difficulty" "Difficulty" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodingQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobDescription_jdGroupId_idx" ON "JobDescription"("jdGroupId");

-- CreateIndex
CREATE INDEX "JobDescription_isLatest_idx" ON "JobDescription"("isLatest");

-- CreateIndex
CREATE UNIQUE INDEX "JobDescription_jdGroupId_version_key" ON "JobDescription"("jdGroupId", "version");

-- CreateIndex
CREATE INDEX "Assessment_role_idx" ON "Assessment"("role");

-- CreateIndex
CREATE INDEX "Assessment_difficulty_idx" ON "Assessment"("difficulty");

-- CreateIndex
CREATE INDEX "McqQuestion_assessmentId_idx" ON "McqQuestion"("assessmentId");

-- CreateIndex
CREATE INDEX "McqQuestion_skill_idx" ON "McqQuestion"("skill");

-- CreateIndex
CREATE INDEX "CodingQuestion_assessmentId_idx" ON "CodingQuestion"("assessmentId");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_jobDescriptionId_fkey" FOREIGN KEY ("jobDescriptionId") REFERENCES "JobDescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "McqQuestion" ADD CONSTRAINT "McqQuestion_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodingQuestion" ADD CONSTRAINT "CodingQuestion_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
