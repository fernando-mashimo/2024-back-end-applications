import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

export class VideosIs {
  @IsUUID()
  @IsString()
  videoId: string
}

export class CreateVideoSubgroupDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  videoId: string

  @IsOptional()
  @IsUUID()
  @IsString()
  videoGroupId: string

  @IsNumber()
  order: number

  @IsString()
  name: string
}
