-- CreateTable
CREATE TABLE "Professional" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cref" VARCHAR,
    "social" VARCHAR,
    "bio" TEXT,
    "accountId" UUID NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Professional_cref_key" ON "Professional"("cref");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_accountId_key" ON "Professional"("accountId");

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
