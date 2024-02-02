
export class CreateNewsResponsePlaylistDto {
    playlistId: string;

    name: string;

    thumb: string;

    release: string;

    categoryId: string;
}

export class CreateNewsResponseDto {
    id: string;

    name: string;

    release: Date;

    createdAt: Date;

    playlists: CreateNewsResponsePlaylistDto[];
}
