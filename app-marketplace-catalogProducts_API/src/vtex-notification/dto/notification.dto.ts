import { IsString, IsBoolean, IsInt, IsDate, IsNotEmpty } from 'class-validator';

export class NotificationDto {
  @IsString()
  @IsNotEmpty()
  IdSku: string;

  @IsString()
  @IsNotEmpty()
  An: string;

  @IsString()
  @IsNotEmpty()
  IdAffiliate: string;

  @IsInt()
  @IsNotEmpty()
  ProductId: number;

  @IsString()
  @IsNotEmpty()
  DateModified: Date;

  @IsBoolean()
  @IsNotEmpty()
  IsActive: boolean;

  @IsBoolean()
  @IsNotEmpty()
  StockModified: boolean;

  @IsBoolean()
  @IsNotEmpty()
  PriceModified: boolean;

  @IsBoolean()
  @IsNotEmpty()
  HasStockKeepingUnitModified: boolean;

  @IsBoolean()
  @IsNotEmpty()
  HasStockKeepingUnitRemovedFromAffiliate: boolean;
}
