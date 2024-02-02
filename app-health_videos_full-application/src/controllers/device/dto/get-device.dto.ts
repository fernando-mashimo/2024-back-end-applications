

import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetDeviceDto {

    @IsString()
    @IsOptional()
    macAddress: string;

    @IsUUID()
    @IsOptional()
    accountId: string;
}
