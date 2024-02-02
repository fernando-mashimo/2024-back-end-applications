-- CreateEnum
CREATE TYPE "PlansType" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('PROFESSIONAL', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "VideoType" AS ENUM ('VIDEO', 'SHORT');

-- CreateEnum
CREATE TYPE "ClassFrequency" AS ENUM ('DAILY', 'WEEKLY');

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT,
    "name" TEXT,
    "surname" TEXT,
    "photo" TEXT,
    "password" TEXT,
    "accountType" "AccountType" NOT NULL,
    "cref" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponsibilityTerm" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "accepted" BOOLEAN NOT NULL,
    "accountId" UUID NOT NULL,
    "responseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResponsibilityTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountPersonalInfo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "accountId" UUID NOT NULL,
    "height" INTEGER,
    "weight" INTEGER,
    "birthday" TIMESTAMP(3),

    CONSTRAINT "AccountPersonalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objectives" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" TEXT NOT NULL,

    CONSTRAINT "Objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountObjectives" (
    "accountId" UUID NOT NULL,
    "objectiveId" UUID NOT NULL,

    CONSTRAINT "AccountObjectives_pkey" PRIMARY KEY ("accountId","objectiveId")
);

-- CreateTable
CREATE TABLE "AccountInterests" (
    "accountId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "AccountInterests_pkey" PRIMARY KEY ("accountId","categoryId")
);

-- CreateTable
CREATE TABLE "MedicalRestrictions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" TEXT NOT NULL,

    CONSTRAINT "MedicalRestrictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountMedicalRestrictions" (
    "accountId" UUID NOT NULL,
    "restrictionId" UUID NOT NULL,

    CONSTRAINT "AccountMedicalRestrictions_pkey" PRIMARY KEY ("accountId","restrictionId")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "startAt" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN DEFAULT false,
    "accountId" UUID NOT NULL,
    "planId" UUID NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "type" "PlansType" NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "thumbPortrait" TEXT NOT NULL,
    "thumbLandscape" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "thumb" TEXT,
    "videoType" "VideoType" NOT NULL,
    "categoryId" UUID NOT NULL,
    "accountId" UUID NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchedVideo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watchedTimeInSecond" INTEGER NOT NULL,
    "accountId" UUID NOT NULL,
    "videoId" UUID NOT NULL,

    CONSTRAINT "WatchedVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" UUID,
    "thumb" TEXT NOT NULL,
    "videoId" UUID NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoGroup" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL,
    "classFrequency" "ClassFrequency" NOT NULL,
    "playlistId" UUID NOT NULL,

    CONSTRAINT "VideoGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoSubgroup" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "videoGroupId" UUID,

    CONSTRAINT "VideoSubgroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoSubgroupVideo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order" INTEGER NOT NULL,
    "videoId" UUID NOT NULL,
    "videoSubgroupId" UUID,

    CONSTRAINT "VideoSubgroupVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "macAddress" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "accountId" UUID NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ResponsibilityTerm_accountId_key" ON "ResponsibilityTerm"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountPersonalInfo_accountId_key" ON "AccountPersonalInfo"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_macAddress_key" ON "Device"("macAddress");

-- AddForeignKey
ALTER TABLE "ResponsibilityTerm" ADD CONSTRAINT "ResponsibilityTerm_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountPersonalInfo" ADD CONSTRAINT "AccountPersonalInfo_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountObjectives" ADD CONSTRAINT "AccountObjectives_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountObjectives" ADD CONSTRAINT "AccountObjectives_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objectives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountInterests" ADD CONSTRAINT "AccountInterests_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountInterests" ADD CONSTRAINT "AccountInterests_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountMedicalRestrictions" ADD CONSTRAINT "AccountMedicalRestrictions_restrictionId_fkey" FOREIGN KEY ("restrictionId") REFERENCES "MedicalRestrictions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedVideo" ADD CONSTRAINT "WatchedVideo_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedVideo" ADD CONSTRAINT "WatchedVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoGroup" ADD CONSTRAINT "VideoGroup_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoSubgroup" ADD CONSTRAINT "VideoSubgroup_videoGroupId_fkey" FOREIGN KEY ("videoGroupId") REFERENCES "VideoGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoSubgroupVideo" ADD CONSTRAINT "VideoSubgroupVideo_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoSubgroupVideo" ADD CONSTRAINT "VideoSubgroupVideo_videoSubgroupId_fkey" FOREIGN KEY ("videoSubgroupId") REFERENCES "VideoSubgroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

