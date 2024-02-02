import { IsOptional, IsString } from 'class-validator'

export class CreateVideoCategoryDto {
  @IsString()
  title: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  thumbLandscape: string

  @IsString()
  @IsOptional()
  thumbPortrait: string

  @IsString()
  @IsOptional()
  icon: string
}
