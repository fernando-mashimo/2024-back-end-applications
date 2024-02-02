import { Controller, Body, Patch, Param, Get } from '@nestjs/common'
import { SubscriptionService } from './subscription.service'
import { routes } from '@src/common/baseRoutes'
import { CreateOrUpdateSubscriptionDto } from './dto/create-or-update-subscription.dto'
import pino from 'pino'
import { PublicEndpoint } from '@src/helpers/public-endpoint'

@Controller(routes.subscription)
export class SubscriptionController {
  private readonly logger = pino()
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Patch('createOrUpdate/:cpf')
  @PublicEndpoint()
  createOrUpdate(
    @Param('cpf') cpf: string,
    @Body() createOrUpdateSubscriptionDto: CreateOrUpdateSubscriptionDto
  ) {
    this.logger.info(`Calling createOrUpdate method for CPF ${cpf}`)
    return this.subscriptionService.createOrUpdate(
      cpf,
      createOrUpdateSubscriptionDto
    )
  }

  @Get(':accountId')
  getSubscription(@Param('accountId') accountId: string) {
    this.logger.info(
      `Calling getSubscription method for accountId ${accountId}`
    )
    return this.subscriptionService.getSubscription(accountId)
  }
}
