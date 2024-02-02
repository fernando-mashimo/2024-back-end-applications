/*
  Warnings:

  - You are about to drop the column `accountId` on the `Video` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_accountId_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "accountId";
