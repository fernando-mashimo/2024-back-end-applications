import {
  IsArray,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  IsUrl
} from 'class-validator'
export class PlaylistVideosDto {
  @IsUUID()
  videoId: string

  @IsNumber()
  @IsNotEmpty()
  order: number
}

export class CreatePlaylistDto {
  @IsNotEmpty()
  @IsNotEmpty()
  name: string

  @IsString()
  description: string

  @IsNotEmpty()
  @IsUUID()
  categoryId: string

  @IsNotEmpty()
  @IsUUID()
  videoId: string

  @IsString()
  @IsUrl()
  thumb: string
}
