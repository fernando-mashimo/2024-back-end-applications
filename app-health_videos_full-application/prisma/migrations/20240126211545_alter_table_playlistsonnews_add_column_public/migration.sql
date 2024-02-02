/*
  Warnings:

  - Added the required column `public` to the `PlaylistsOnNews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlaylistsOnNews"
  ADD COLUMN "public" BOOLEAN NULL;

-- update PlaylistsOnNews.public true
UPDATE "PlaylistsOnNews" pon
  SET "public" = true::BOOLEAN
  WHERE pon."public" IS NULL;

-- AlterTable set News.public as not null
ALTER TABLE "PlaylistsOnNews"
  ALTER COLUMN "public" SET NOT NULL;

-- CreateIndex
CREATE INDEX "PlaylistsOnNews_public_idx" ON "PlaylistsOnNews"("public");
