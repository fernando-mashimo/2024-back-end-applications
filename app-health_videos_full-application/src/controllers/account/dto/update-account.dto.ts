import { PartialType } from '@nestjs/mapped-types'
import {
  IsArray,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'
import { CreateAccountDto } from './create-account.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  MedicalRestrictions,
  Objectives
} from '../../account-details/entities/account-details.entity'

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ description: "User's email" })
  email: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "User's First name" })
  name: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "User's last name" })
  surname: string

  @IsDefined()
  @IsOptional()
  @ApiProperty({ description: "User's profile image" })
  photo?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "User's current password" })
  oldPassword: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "User's new password" })
  password: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "User's height in centimeters" })
  height: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "User's weight in kilograms" })
  weight: number

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({ description: "User's birth date in ISO 8601 format" })
  birthday: Date

  @IsArray()
  @IsEnum(Object.keys(Objectives), { each: true })
  @IsOptional()
  @ApiProperty({
    description: 'User objectives',
    enum: Object.keys(Objectives),
    isArray: true
  })
  objectives: Objectives[]

  @IsArray()
  @IsEnum(Object.keys(MedicalRestrictions), { each: true })
  @IsOptional()
  @ApiProperty({
    description: 'User medical restrictions',
    enum: Object.keys(MedicalRestrictions),
    isArray: true
  })
  medicalRestrictions: MedicalRestrictions[]

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({
    description: 'User interests categories',
    isArray: true
  })
  interests: string[]
}
