
export class VideoHistoryDto {
    id: string;

    name: string;

    thumb: string;

    link?: string;
}

export class FindWatchedVideoHistoryResponseDto {
    id: string;

    watchedAt: Date;

    watchedTimeInSeconds: number;

    video: VideoHistoryDto;
}

export class HistoryDayEntryDto {
    id: string;

    watchedAt: string;

    watchedTimeInSeconds: string;

    video: VideoHistoryDto;
}

export class VideoHistoryResponseDto {
    year: string;

    month: string;

    day: HistoryDayEntryDto[];
}
