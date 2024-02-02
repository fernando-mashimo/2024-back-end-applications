/*
  Warnings:

  - You are about to drop the column `active` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `billingFrequency` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_planId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "active",
DROP COLUMN "planId",
ADD COLUMN     "billingFrequency" TEXT NOT NULL,
ADD COLUMN     "expDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_accountId_key" ON "Subscription"("accountId");
