import { PartialType } from '@nestjs/mapped-types'
import { CreatePlaylistDto } from './createPlaylist.dto'
import { IsNotEmpty, IsNumber, IsUUID, ValidateNested } from 'class-validator'

export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto) {}

export class Videos {
  @IsNumber()
  order: number

  @IsNotEmpty()
  @IsUUID()
  videoId: string

  @IsNotEmpty()
  @IsUUID()
  playlistId: string
}

export class PlaylistVideos {
  @ValidateNested()
  videos: Videos[]
}
