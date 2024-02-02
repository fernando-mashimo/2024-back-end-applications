/*
  Warnings:

  - You are about to drop the `AccountInterests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccountMedicalRestrictions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccountObjectives` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccountPersonalInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicalRestrictions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Objectives` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccountInterests" DROP CONSTRAINT "AccountInterests_accountId_fkey";

-- DropForeignKey
ALTER TABLE "AccountInterests" DROP CONSTRAINT "AccountInterests_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "AccountMedicalRestrictions" DROP CONSTRAINT "AccountMedicalRestrictions_restrictionId_fkey";

-- DropForeignKey
ALTER TABLE "AccountObjectives" DROP CONSTRAINT "AccountObjectives_accountId_fkey";

-- DropForeignKey
ALTER TABLE "AccountObjectives" DROP CONSTRAINT "AccountObjectives_objectiveId_fkey";

-- DropForeignKey
ALTER TABLE "AccountPersonalInfo" DROP CONSTRAINT "AccountPersonalInfo_accountId_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "weight" INTEGER;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "accountId" UUID;

-- DropTable
DROP TABLE "AccountInterests";

-- DropTable
DROP TABLE "AccountMedicalRestrictions";

-- DropTable
DROP TABLE "AccountObjectives";

-- DropTable
DROP TABLE "AccountPersonalInfo";

-- DropTable
DROP TABLE "MedicalRestrictions";

-- DropTable
DROP TABLE "Objectives";

-- CreateTable
CREATE TABLE "AccountCategoryInterests" (
    "accountId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "accountDetailsId" UUID,

    CONSTRAINT "AccountCategoryInterests_pkey" PRIMARY KEY ("accountId","categoryId")
);

-- CreateTable
CREATE TABLE "AccountDetails" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "accountId" UUID NOT NULL,
    "medicalRestrictions" TEXT[],
    "objectives" TEXT[],

    CONSTRAINT "AccountDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountDetails_accountId_key" ON "AccountDetails"("accountId");

-- AddForeignKey
ALTER TABLE "AccountCategoryInterests" ADD CONSTRAINT "AccountCategoryInterests_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountCategoryInterests" ADD CONSTRAINT "AccountCategoryInterests_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountCategoryInterests" ADD CONSTRAINT "AccountCategoryInterests_accountDetailsId_fkey" FOREIGN KEY ("accountDetailsId") REFERENCES "AccountDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountDetails" ADD CONSTRAINT "AccountDetails_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
