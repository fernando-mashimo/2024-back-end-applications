/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "cpf" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_cpf_key" ON "Account"("cpf");
