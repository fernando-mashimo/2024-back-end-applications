import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class NutriIds {
    externalId: string;
    uidv4Nutri: string
}

export class CreateProductVtexDto {
  @IsNumber()
  @ApiProperty()
  categoryId: number;

  @IsString()
  @ApiProperty()
  sellerId: string;

  @ApiProperty()
  @Type(() => NutriIds)
  nutriIds: NutriIds;

  @ApiProperty()
  @IsString()
  crnId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageUrl: string;

  @ApiProperty()
  @IsNumber()
  price: number;
}
