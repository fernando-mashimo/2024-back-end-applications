import { IsDefined, IsOptional, IsString } from 'class-validator';

export class UpdateAppSubscriptionOrderDto {
  @IsOptional()
  @IsString()
  coupon?: string;

  @IsDefined()
  @IsOptional()
  file: Express.Multer.File;
}
