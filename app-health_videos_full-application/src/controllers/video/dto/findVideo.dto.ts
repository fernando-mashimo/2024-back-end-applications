import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { VideoType } from './videoType.enum'

export class FindVideoDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  itemPerPage: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageNumber: number

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(VideoType)
  type: VideoType
}
