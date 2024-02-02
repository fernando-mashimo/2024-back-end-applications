import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

export class UserInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Users First name' })
  name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Users last name' })
  surname: string

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Users email' })
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Users password' })
  password: string

  @IsString()
  @ApiProperty({ description: 'Users CPF' })
  cpf: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Users height in centimeters' })
  height?: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Users weight in kilograms' })
  weight?: number

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({ description: 'Users birth date in ISO 8601 format' })
  birthday?: Date
}
