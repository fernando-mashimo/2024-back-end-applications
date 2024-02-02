/*
  Warnings:

  - You are about to drop the column `accountType` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable to add migration column
ALTER TABLE "Account"
  ADD COLUMN "accountTypeMigration" VARCHAR NULL;

-- UpdateTable and set data from original column to migration column
UPDATE "Account"
  SET "accountTypeMigration" = "accountType"::VARCHAR
  WHERE "accountTypeMigration" IS NULL;

-- AlterTable to drop original column
ALTER TABLE "Account"
  DROP COLUMN "accountType";

-- AlterTable to rename migration column as original column name
ALTER TABLE "Account"
  RENAME COLUMN "accountTypeMigration" TO "accountType";

-- AlterTable to set column as not null, since data migration is complete
ALTER TABLE "Account"
  ALTER COLUMN "accountType" SET NOT NULL;
