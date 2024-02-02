-- CreateTable
CREATE TABLE "News" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "release" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistsOnNews" (
    "thumb" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL,
    "release" TIMESTAMP NOT NULL,
    "playlistId" UUID NOT NULL,
    "newsId" UUID NOT NULL,

    CONSTRAINT "PlaylistsOnNews_pkey" PRIMARY KEY ("playlistId","newsId")
);

-- AddForeignKey
ALTER TABLE "PlaylistsOnNews" ADD CONSTRAINT "PlaylistsOnNews_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistsOnNews" ADD CONSTRAINT "PlaylistsOnNews_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
