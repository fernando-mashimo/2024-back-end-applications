import { Module } from '@nestjs/common'
import { DeviceService } from './device.service'
import { DeviceController } from './device.controller'
import { AccountService } from '../account/account.service'
import { PrismaModule } from '@src/database/prisma.module'

@Module({
  controllers: [DeviceController],
  providers: [DeviceService, AccountService],
  imports: [PrismaModule]
})
export class DeviceModule {}
