import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "User's First name" })
  name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "User's last name" })
  surname: string

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: "User's email" })
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  @ApiProperty({ description: "User's password" })
  password: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "User's CPF" })
  cpf: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "User's height in centimeters" })
  height: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "User's weight in kilograms" })
  weight: number

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @ApiProperty({ description: "User's birth date in ISO 8601 format" })
  birthday: Date

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty({ description: 'Agreement to terms and conditions' })
  accepted: boolean
}
