/*
  Warnings:

  - Added the required column `public` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable add News.public as nullable
ALTER TABLE "News"
  ADD COLUMN "public" BOOLEAN NULL;

-- update News.public true
UPDATE "News" n
  SET "public" = true::BOOLEAN
  WHERE n."public" IS NULL;

-- AlterTable set News.public as not null
ALTER TABLE "News"
  ALTER COLUMN "public" SET NOT NULL;

-- CreateIndex
CREATE INDEX "News_public_idx" ON "News"("public");
