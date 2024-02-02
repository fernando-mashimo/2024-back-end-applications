import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class FindVideoWatchedDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    required: false
  })
  itemPerPage: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({
    required: false
  })
  pageNumber: number
}
