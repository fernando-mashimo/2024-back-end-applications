import { Prisma } from "@prisma/client";

export class VideoWatched implements Prisma.WatchedVideoCreateInput {
    id?: string;
    watchedAt?: string | Date;
    watchedTimeInSecond: number;
    account: Prisma.AccountCreateNestedOneWithoutWatchedVideoInput;
    video: Prisma.VideoCreateNestedOneWithoutWatchedVideoInput;
}
