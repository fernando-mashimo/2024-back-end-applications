import {
  IsString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Origin } from '../common/enums';

export class CreateAppSubscriptionOrderDto {
  @IsNotEmpty()
  @IsString()
  nutritionistId: string;

  @IsNotEmpty()
  @IsIn(Object.values(Origin))
  origin: Origin;

  @IsNotEmpty()
  @IsString()
  orderFormId: string;

  @IsNotEmpty()
  @IsNumber()
  subscriptionPriceBRL: number;

  @IsNotEmpty()
  @IsNumber()
  subscriptionPricePoints: number;

  @IsOptional()
  @IsString()
  fullName?: string;
}
