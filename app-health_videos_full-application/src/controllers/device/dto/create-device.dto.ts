import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  macAddress: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsOptional()
  accountId: String;
}
