/*
  Warnings:

  - You are about to drop the column `createdId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `createdId` on the `JobDescription` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `JobDescription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_createdId_fkey";

-- DropForeignKey
ALTER TABLE "JobDescription" DROP CONSTRAINT "JobDescription_createdId_fkey";

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "createdId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobDescription" DROP COLUMN "createdId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "JobDescription" ADD CONSTRAINT "JobDescription_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
