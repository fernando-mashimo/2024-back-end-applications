import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional } from 'class-validator'

export class RegisterPersonalInfoDto {
  // @IsUUID()
  // @IsString()
  // @IsOptional()
  // accountId: string // Use 'string' com 's' minúsculo, em vez de 'String'

  @IsNumber()
  @IsOptional()
  height?: number

  @IsNumber()
  @IsOptional()
  weight?: number

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  birthday?: Date
}
