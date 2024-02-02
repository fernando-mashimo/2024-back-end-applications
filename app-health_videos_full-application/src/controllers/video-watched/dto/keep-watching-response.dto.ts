
class KeepWatchingCategoryDto {
    id: string;

    title: string;

    icon: string;
}

class KeepWatchingProfessionalDto {
    id: string;

    fullName: string;

    social: string;

    cref: string;

    photo: string;
}

export class KeepWatchingLastVideosResponseDto {
    id: string;

    name: string;

    thumb: string;

    link: string;

    watchedTimeInSeconds: string;

    videoId: string;

    category: KeepWatchingCategoryDto;

    professional: KeepWatchingProfessionalDto;
}
