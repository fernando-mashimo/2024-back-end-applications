import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { UpdatePaymentDto } from './dto'
import { AxiosError } from 'axios'
import { BadRequest } from '@src/errors/bad-request'
import { PrismaService } from '@src/database/prisma.service'
import {
  makeSubscription,
  makeSubscriptionPix,
  Subscription
} from './dto/createSubscription.dto'

import { CreatePaymentPixDto } from './dto/createPayment.dto'

import { CreatePaymentCreditCardDto } from './dto/createPayment.dto'
import { RejectedPayment } from '@src/errors'
import { PaymentPix } from './helper/pagarme.contract'

@Injectable()
export class PaymentService {
  private readonly URL_API = process.env.URL_API_PAGARME
  private readonly URL_API_KEY_SECRET = process.env.URL_API_KEY_SECRET
  private readonly headers = {
    Authorization: `Basic ${Buffer.from(this.URL_API_KEY_SECRET + ':').toString(
      'base64'
    )}`,
    'Content-Type': 'application/json'
  }

  private readonly logger = new Logger(PaymentService.name)

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService
  ) { }

  // async create({ customer, card, planId }: CreatePaymentCreditCardDto) {
  //   const plan = await this.prisma.plan.findFirstOrThrow({
  //     where: {
  //       id: planId
  //     }
  //   })

  //   const account = await this.prisma.account.findFirstOrThrow({
  //     where: {
  //       id: customer.id
  //     }
  //   })

  //   const today = new Date()

  //   const addMonths = plan.type === 'YEARLY' ? 12 : 1

  //   const endDate = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate()
  //   )

  //   endDate.setMonth(today.getMonth() + addMonths)

  //   const foundSubs = await this.prisma.subscription.findFirst({
  //     where: {
  //       accountId: account.id,
  //       // active: true,
  //       endDate: {
  //         gte: new Date().toISOString()
  //       },
  //       // planId: plan.id
  //     }
  //   })

  //   if (foundSubs) {
  //     throw new RejectedPayment('Customer already has an active subscription', {
  //       foundSubs
  //     })
  //   }

  //   const subscription = await this.prisma.subscription.create({
  //     data: {
  //       startAt: today.toISOString(),
  //       endDate: endDate.toISOString(),
  //       // active: false,
  //       accountId: account.id,
  //       // planId: plan.id
  //     }
  //   })

  //   const subscriptionToCreate = makeSubscription({
  //     card: card,
  //     customer: {
  //       ...customer,
  //       address: card.billing_address
  //     },
  //     billingAddress: card.billing_address,
  //     plan: {
  //       interval: plan.type === 'MONTHLY' ? 'month' : 'year',
  //       installments: plan.type === 'MONTHLY' ? 12 : 1,
  //       name: plan.name,
  //       price: plan.priceInCents
  //     },
  //     subscriptionId: subscription.id
  //   })

  //   return this.httpService.axiosRef
  //     .post<Subscription.Output.Base>(
  //       this.URL_API + '/core/v5/subscriptions',
  //       subscriptionToCreate,
  //       {
  //         headers: this.headers
  //       }
  //     )
  //     .then(async ({ data }) => {
  //       if (data.status !== 'active') {
  //         throw new RejectedPayment('payment failure', {
  //           data
  //         })
  //       }

  //       await this.prisma.subscription.update({
  //         where: {
  //           id: subscription.id
  //         },
  //         data: {
  //           active: true
  //         }
  //       })

  //       this.logger.debug(data)

  //       return data
  //     })
  //     .catch((error: AxiosError) => {
  //       this.logger.error(error)

  //       throw new BadRequest(error.message, {
  //         response: error?.response?.data
  //       })
  //     })
  // }

  // async pix({ customer, planId }: CreatePaymentPixDto) {
  //   const plan = await this.prisma.plan.findFirstOrThrow({
  //     where: {
  //       id: planId
  //     }
  //   })

  //   const account = await this.prisma.account.findFirstOrThrow({
  //     where: {
  //       id: customer.id
  //     }
  //   })

  //   const today = new Date()

  //   const addMonths = plan.type === 'YEARLY' ? 12 : 1

  //   const endDate = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate()
  //   )

  //   endDate.setMonth(today.getMonth() + addMonths)

  //   const foundSubs = await this.prisma.subscription.findFirst({
  //     where: {
  //       accountId: account.id,
  //       active: true,
  //       endDate: {
  //         gte: new Date().toISOString()
  //       },
  //       planId: plan.id
  //     }
  //   })

  //   if (foundSubs) {
  //     throw new RejectedPayment('Customer already has an active subscription', {
  //       foundSubs
  //     })
  //   }

  //   const subscription = await this.prisma.subscription.create({
  //     data: {
  //       startAt: today.toISOString(),
  //       endDate: endDate.toISOString(),
  //       active: false,
  //       accountId: account.id,
  //       planId: plan.id
  //     }
  //   })

  //   const subscriptionToCreate = makeSubscriptionPix(
  //     {
  //       name: customer.name,
  //       document: customer.document,
  //       email: customer.email,
  //       type: customer.type,
  //       phones: {
  //         mobile_phone: {
  //           area_code: customer.phone.area_code,
  //           number: customer.phone.number,
  //           country_code: '55'
  //         }
  //       },
  //       metadata: {
  //         subscriptionId: subscription.id,
  //         accountId: account.id
  //       }
  //     },
  //     plan
  //   )

  //   return this.httpService.axiosRef
  //     .post<PaymentPix.Output.Base>(
  //       this.URL_API + '/core/v5/orders',
  //       subscriptionToCreate,
  //       {
  //         headers: this.headers
  //       }
  //     )
  //     .then(async ({ data }) => {
  //       if (data.status !== 'pending') {
  //         this.logger.error(data)
  //         throw new RejectedPayment('Payment Failure', {
  //           data
  //         })
  //       }

     

  //       this.logger.debug(data)

  //       return data
  //     })
  //     .catch((error: AxiosError) => {
  //       this.logger.error(error)

  //       throw new BadRequest(error.message, {
  //         response: error?.response?.data
  //       })
  //     })
  // }

  // async findAll(customerId?: string) {
  //   return this.httpService.axiosRef
  //     .get(this.URL_API + '/core/v5/charges', {
  //       headers: this.headers,
  //       params: {
  //         customer_id: customerId,
  //         page: 1,
  //         size: 10
  //       }
  //     })
  //     .then(({ data }) => data)
  //     .catch((error: AxiosError) => {
  //       this.logger.error(error)
  //       throw new BadRequest(error.message, {
  //         ...error.response
  //       })
  //     })
  // }

  // async findOne(chargeId: string) {
  //   return this.httpService.axiosRef
  //     .get(this.URL_API + '/core/v5/charges/' + chargeId, {
  //       headers: this.headers
  //     })
  //     .then(({ data }) => data)
  //     .catch((error: AxiosError) => {
  //       this.logger.error(error)
  //       throw new BadRequest(error.message, {
  //         ...error.response
  //       })
  //     })
  // }

  // async chargePaid(input: PaymentPix.Webhook.ChargePaid.Base) {
  //   this.logger.log({ input })

  //   if (input.status !== 'paid') {
  //     return
  //   }
  //   await this.prisma.subscription.update({
  //     where: {
  //       id: input.customer.metadata.subscriptionId
  //     },
  //     data: {
  //       active: true
  //     }
  //   })
  // }

  // update(id, updatePaymentDto: UpdatePaymentDto) {
  //   return `This action update a #${id} payment`
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} payment`
  // }
}
