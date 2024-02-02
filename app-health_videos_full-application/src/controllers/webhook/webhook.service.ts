import { Injectable, Logger } from '@nestjs/common'
import { CreateWebhookDto } from './dto/create-webhook.dto'
import { UpdateWebhookDto } from './dto/update-webhook.dto'
import { HttpService } from '@nestjs/axios'
import { PrismaService } from '@src/database/prisma.service'
import { PaymentService } from '../payment/payment.service'
import { ChargePaidDto } from '../payment/dto/ChargePaid.dto'

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name)
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService
  ) { }
  // create(createWebhookDto: CreateWebhookDto) {
  //   return 'This action adds a new webhook'
  // }

  // chargePaid(chargePaid: ChargePaidDto) {
  //   this.logger.log('WebhookService: ', { chargePaid })
  //   return this.paymentService.chargePaid(chargePaid.data)
  // }

  // findAll() {
  //   return `This action returns all webhook`
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} webhook`
  // }

  // update(id: number, updateWebhookDto: UpdateWebhookDto) {
  //   return `This action updates a #${id} webhook`
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} webhook`
  // }
}
