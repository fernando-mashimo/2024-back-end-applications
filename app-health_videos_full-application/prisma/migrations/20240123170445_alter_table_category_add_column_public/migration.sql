/*
  Warnings:

  - Added the required column `public` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable add Category.public as nullable
ALTER TABLE "Category"
  ADD COLUMN "public" BOOLEAN NULL;

-- fill Category.public
UPDATE "Category" c
  SET "public" = true::BOOLEAN
  WHERE c."public" IS NULL;

-- AlterTable set Category.public as not null
ALTER TABLE "Category"
  ALTER COLUMN "public" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Category_public_idx" ON "Category"("public");
