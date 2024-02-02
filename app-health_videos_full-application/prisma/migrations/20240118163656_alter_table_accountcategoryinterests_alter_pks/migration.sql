/*
  Warnings:

  - The primary key for the `AccountCategoryInterests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accountId` on the `AccountCategoryInterests` table. All the data in the column will be lost.
  - Made the column `accountDetailsId` on table `AccountCategoryInterests` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AccountCategoryInterests" DROP CONSTRAINT "AccountCategoryInterests_accountDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "AccountCategoryInterests" DROP CONSTRAINT "AccountCategoryInterests_accountId_fkey";

-- AlterTable
ALTER TABLE "AccountCategoryInterests" DROP CONSTRAINT "AccountCategoryInterests_pkey",
DROP COLUMN "accountId",
ALTER COLUMN "accountDetailsId" SET NOT NULL,
ADD CONSTRAINT "AccountCategoryInterests_pkey" PRIMARY KEY ("accountDetailsId", "categoryId");

-- AddForeignKey
ALTER TABLE "AccountCategoryInterests" ADD CONSTRAINT "AccountCategoryInterests_accountDetailsId_fkey" FOREIGN KEY ("accountDetailsId") REFERENCES "AccountDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
