import { Module } from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { SubscriptionController } from './subscription.controller'
import { PrismaModule } from '@src/database/prisma.module'
import { ApiKeyService } from '../auth/api-key/api-key.service'

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, ApiKeyService],
  imports: [PrismaModule]
})
export class SubscriptionModule {}
