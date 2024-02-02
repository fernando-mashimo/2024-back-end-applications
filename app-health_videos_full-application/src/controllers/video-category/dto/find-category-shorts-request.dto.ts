import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsOptional, IsNumber } from "class-validator"

export class FindCategoryShortsRequestDto {
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
