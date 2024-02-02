import { IsNotEmpty, IsString } from 'class-validator'

export class DeviceHeaderDto {
  @IsString()
  @IsNotEmpty()
  macaddress: string
}
