
class VideoIntroDto {
    id: string;

    name: string;

    link: string;

    type: string;
}

export class FindCategoryIntrosResponseDto {
    id: string;

    title: string;

    icon: string;

    video: VideoIntroDto;
}
