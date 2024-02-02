/*
  Warnings:

  - You are about to drop the `_AccountToPasswordResetTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AccountToPasswordResetTokens" DROP CONSTRAINT "_AccountToPasswordResetTokens_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccountToPasswordResetTokens" DROP CONSTRAINT "_AccountToPasswordResetTokens_B_fkey";

-- DropTable
DROP TABLE "_AccountToPasswordResetTokens";

-- AddForeignKey
ALTER TABLE "PasswordResetTokens" ADD CONSTRAINT "PasswordResetTokens_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
