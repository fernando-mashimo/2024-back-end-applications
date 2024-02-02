import { Type } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class FindVideoGroupDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  itemPerPage: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageNumber: number
}
