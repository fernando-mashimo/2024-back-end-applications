
class BaseGroupDto {
    id: string;

    order: number;

    name: string;
}

export class VideoDto extends BaseGroupDto {
    thumb: string;

    link: string;
}

export class PlaylistSubgroupDto extends BaseGroupDto {
    videos: VideoDto[];
}

export class PlaylistGroupDto extends BaseGroupDto {
    subgroups: PlaylistSubgroupDto[];
}

export class FindPlaylistVideosResponseDto {
    id: string;

    name: string;

    description: string;

    thumb: string;

    content: PlaylistGroupDto[];
}
