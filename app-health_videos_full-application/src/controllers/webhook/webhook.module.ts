import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { PaymentService } from '../payment/payment.service';
import { HttpModule } from '@nestjs/axios'
import { PrismaModule } from '@src/database/prisma.module';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, PaymentService],
  imports: [
    PrismaModule,
    HttpModule.register({
      timeout: 10000
    })
  ],
})
export class WebhookModule { }
