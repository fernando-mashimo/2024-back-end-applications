import { Module } from '@nestjs/common'
import { AccountDetailsService } from './account-details.service'
import { PrismaModule } from '@src/database/prisma.module'
import { PrismaService } from '@src/database/prisma.service'

@Module({
  providers: [AccountDetailsService, PrismaService],
  imports: [PrismaModule]
})
export class AccountDetailsModule {}
