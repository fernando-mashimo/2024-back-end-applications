import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceDto } from './create-device.dto';
import { IsBoolean, IsUUID } from 'class-validator';

export class UpdateDeviceDto {

    @IsBoolean()
    active: boolean;
    
}
