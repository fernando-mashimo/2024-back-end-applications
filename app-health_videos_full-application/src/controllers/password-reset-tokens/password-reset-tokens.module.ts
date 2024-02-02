import { Module } from '@nestjs/common'
import { PasswordResetTokensService } from './password-reset-tokens.service'
import { PrismaModule } from '@src/database/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [PasswordResetTokensService]
})
export class PasswordResetTokensModule {}
