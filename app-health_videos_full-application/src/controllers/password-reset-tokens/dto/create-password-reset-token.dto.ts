import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreatePasswordResetTokenDto {
  @IsNotEmpty()
  @IsUUID()
  accountId: string
}
