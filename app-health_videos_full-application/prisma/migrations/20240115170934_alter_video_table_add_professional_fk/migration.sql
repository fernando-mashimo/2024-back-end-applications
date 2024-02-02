/*
  Warnings:

  - Added the required column `professionalId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video"
  ADD COLUMN "professionalId" UUID NULL;

-- AddForeignKey
ALTER TABLE "Video"
  ADD CONSTRAINT "Video_professionalId_fkey"
    FOREIGN KEY ("professionalId") REFERENCES "Professional"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;

-- Copy professional.id to professional_fk where accountId
UPDATE "Video" v
  SET "professionalId" = (
    SELECT p."id"
    FROM "Professional" p
    WHERE p."accountId" = v."accountId"
  )
  WHERE v."professionalId" IS NULL;

ALTER TABLE "Video"
  ALTER COLUMN "professionalId" SET NOT NULL;
