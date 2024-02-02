import { IsOptional, ValidateNested } from 'class-validator'
import { VideosIs } from './createVideoGroup.dto'

export class AddVideoGroupDto {
  @IsOptional()
  @ValidateNested()
  videos?: VideosIs[]
}
