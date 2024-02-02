import { IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email address to be sent the reset password link'
  })
  email: string
}
