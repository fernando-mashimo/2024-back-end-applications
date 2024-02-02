import { ApiProperty } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested
} from 'class-validator'
import { VideoType } from './videoType.enum'

export class CreateVideoDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  link: string

  @IsNotEmpty()
  @IsEnum(VideoType)
  @ApiProperty({
    enumName: 'VideoType',
    enum: VideoType,
  })
  videoType: VideoType

  @IsNotEmpty()
  @IsUUID()
  categoryId: string

  @IsNotEmpty()
  @IsUUID()
  professionalId: string

  @IsOptional()
  @IsString()
  thumb: string

  @IsOptional()
  @IsString()
  accountId: string
}

export class CreateVideoListDto {
  @ValidateNested()
  videos: CreateVideoDto[]
}
