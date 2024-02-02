import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested
} from 'class-validator'

export class VideosIs {
  @IsUUID()
  @IsString()
  videoId: string
}

export class VideoSubgroup {
  @IsUUID()
  @IsString()
  videoSubgroupId: string
}

export class CreateVideoGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  order: 0

  @IsString()
  @IsEnum(['DAILY', 'SHORT'])
  classFrequency: 'DAILY'

  @IsUUID()
  @IsString()
  playlistId: string

  @IsOptional()
  @ValidateNested()
  videos?: VideosIs[] = []
}
