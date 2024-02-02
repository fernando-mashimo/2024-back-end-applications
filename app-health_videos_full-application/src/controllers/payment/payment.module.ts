import { Module } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { HttpModule } from '@nestjs/axios'
import { PlanService } from '../plan/plan.service'
import { SubscriptionService } from '../subscription/subscription.service'
import { PrismaModule } from '@src/database/prisma.module'
import { ApiKeyModule } from '../auth/api-key/api-key.module'

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PlanService, SubscriptionService],
  imports: [
    PrismaModule,
    HttpModule.register({
      timeout: 10000
    }),
    ApiKeyModule
  ]
})
export class PaymentModule {}
