/*
  Warnings:

  - Changed the type of `videoType` on the `Video` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/

/*
  Steps to change type o videoType column from enum to text
*/

-- 1. First create column to contain data from the original column
ALTER TABLE "Video"
  ADD COLUMN "videoTypeMigration" TEXT NULL;

-- 2. Add data from original column to the migration column while casting original enum data to text
UPDATE "Video"
  SET "videoTypeMigration" = "videoType"::TEXT;

-- 3. Drop original column
ALTER TABLE "Video"
  DROP COLUMN "videoType";

-- 4. Rename migration column with text type
ALTER TABLE "Video"
  RENAME COLUMN "videoTypeMigration" TO "videoType";

-- 5. Set column to not null
ALTER TABLE "Video"
  ALTER COLUMN "videoType" SET NOT NULL;
