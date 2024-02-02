import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class VerifyTokenDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email address from which the password will be reset'
  })
  email: string

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Token to be validated against the persisted one'
  })
  token: number
}
