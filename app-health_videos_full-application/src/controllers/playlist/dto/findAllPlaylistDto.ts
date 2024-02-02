import { Transform, Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator'

export class FindAllPlaylistDto {
	@IsOptional()
	@Type(() => Number)
	@Transform(({ value }) => Number(value))
	@IsNumber()
	itemPerPage: number

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Transform(({ value }) => Number(value))
	pageNumber: number

	@IsOptional()
	@IsUUID()
	categoryId:  string
}
