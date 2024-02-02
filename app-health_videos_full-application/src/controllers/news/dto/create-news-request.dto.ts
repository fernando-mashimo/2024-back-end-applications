import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class PlaylistDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsOptional()
    @IsString()
    thumb: string;

    @IsOptional()
    @IsDateString()
    release?: Date;
}

export class CreateNewsRequestDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsDateString()
    release?: Date;

    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => PlaylistDto)
    playlists: PlaylistDto[];
}
