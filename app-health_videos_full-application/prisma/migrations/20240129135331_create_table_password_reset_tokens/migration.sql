-- CreateTable
CREATE TABLE "PasswordResetTokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL,
    "accountId" UUID NOT NULL,

    CONSTRAINT "PasswordResetTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AccountToPasswordResetTokens" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccountToPasswordResetTokens_AB_unique" ON "_AccountToPasswordResetTokens"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountToPasswordResetTokens_B_index" ON "_AccountToPasswordResetTokens"("B");

-- AddForeignKey
ALTER TABLE "_AccountToPasswordResetTokens" ADD CONSTRAINT "_AccountToPasswordResetTokens_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToPasswordResetTokens" ADD CONSTRAINT "_AccountToPasswordResetTokens_B_fkey" FOREIGN KEY ("B") REFERENCES "PasswordResetTokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
