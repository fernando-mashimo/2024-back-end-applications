import { Controller, Post, Body } from '@nestjs/common'
import { WebhookService } from './webhook.service'
import { ChargePaidDto } from '../payment/dto/ChargePaid.dto'
import { PaymentService } from '../payment/payment.service'
import { routes } from '@src/common/baseRoutes'

@Controller(routes.webhook)
export class WebhookController {
  constructor(private readonly paymentService: PaymentService) { }

  // @Post('/payment/charge-paid')
  // chargePaid(@Body() chargePaid: ChargePaidDto) {
  //   return this.paymentService.chargePaid(chargePaid.data)
  // }
}
