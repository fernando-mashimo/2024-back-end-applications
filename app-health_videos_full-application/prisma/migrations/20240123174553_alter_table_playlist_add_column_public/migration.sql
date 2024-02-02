/*
  Warnings:

  - Added the required column `public` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable add Playlist.public as nullable
ALTER TABLE "Playlist"
  ADD COLUMN "public" BOOLEAN NULL;

-- fill Playlist.public
UPDATE "Playlist" p
  SET "public" = true::BOOLEAN
  WHERE p."public" IS NULL;

-- AlterTable
ALTER TABLE "Playlist"
  ALTER COLUMN "public" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Playlist_public_idx" ON "Playlist"("public");
