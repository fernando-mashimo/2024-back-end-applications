import { IsNotEmpty, IsNumberString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyCpfDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(11, 11)
  @ApiProperty({
    description: "User's CPF"
  })
  cpf: string
}
