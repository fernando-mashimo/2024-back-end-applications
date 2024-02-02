-- CreateTable
CREATE TABLE "ApiKeys" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" UUID NOT NULL,
    "holder" VARCHAR(100) NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeys_key_key" ON "ApiKeys"("key");
