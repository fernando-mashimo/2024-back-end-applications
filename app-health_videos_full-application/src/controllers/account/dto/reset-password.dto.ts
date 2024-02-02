import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { CreateAccountDto } from './create-account.dto'
import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordDto extends PartialType(CreateAccountDto) {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: "User's id" })
  accountId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "User's new password" })
  password: string
}
