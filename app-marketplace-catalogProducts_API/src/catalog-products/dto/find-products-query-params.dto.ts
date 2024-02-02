import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export class FindProductsQueryParamsDto {
  @IsNumber()
  @ApiProperty()
  page: number;

  @IsNumber()
  @ApiProperty()
  limit: number;

  @IsNumber()
  @ApiProperty()
  categoryId: number;

  @IsNumber()
  @ApiProperty()
  brandId: number;

  @IsString()
  @ApiProperty()
  sellers: string[];

  @ApiProperty()
  @IsEnum(Order)
  orderByName: Order;

  @ApiProperty()
  @IsEnum(Order)
  orderByPrice: Order;

  @ApiProperty()
  @IsString()
  search: string
}
