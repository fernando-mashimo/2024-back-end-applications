import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateOrUpdateSubscriptionDto } from './dto/create-or-update-subscription.dto'
import pino from 'pino'
import { PrismaService } from '@src/database/prisma.service'
import { ApiKeyService } from '../auth/api-key/api-key.service'

@Injectable()
export class SubscriptionService {
  private readonly logger = pino()

  constructor(
    private readonly prisma: PrismaService,
    private readonly apiKeyService: ApiKeyService
  ) {}

  async createOrUpdate(
    cpf: string,
    createOrUpdateSubscriptionDto: CreateOrUpdateSubscriptionDto
  ) {
    try {
      const { plan_mode, status, apiKey } = createOrUpdateSubscriptionDto

      this.logger.info(`Checking if Api Key is valid`)
      const validApiKeyData = await this.apiKeyService.verifyKey(apiKey)

      this.logger.info('Retrieving accountId...')
      const account = await this.prisma.account.findUnique({
        where: {
          cpf
        },
        select: {
          id: true
        }
      })
      if (!account) {
        throw new NotFoundException(`Account with CPF ${cpf} not found`)
      }
      this.logger.info(`Account found - id: ${account.id}`)
      const accountId = account.id

      const expTimeInDays = {
        mensal: 30,
        trimestral: 90,
        semestral: 180,
        anual: 365,
        free: 9999
      }
      const billingFrequency = {
        mensal: 'month',
        trimestral: 'quarter-year',
        semestral: 'half-year',
        anual: 'year',
        free: 'free'
      }

      const data = {
        startAt: new Date(Date.now()),
        expDate: new Date(
          Date.now() + expTimeInDays[plan_mode] * 24 * 60 * 60 * 1000
        ),
        endDate: null,
        status,
        billingFrequency: billingFrequency[plan_mode],
        updatedBy: validApiKeyData?.holder,
        account: {
          connect: {
            id: accountId
          }
        }
      }
      this.logger.info(`Updating subscription for accountId ${accountId}`)
      const subscription = await this.prisma.subscription.upsert({
        where: { accountId },
        create: data,
        update: data
      })
      this.logger.info(`Subscription for accountId ${accountId} updated`)
      return subscription
    } catch (error) {
      if (error.status === 403) {
        this.logger.error(error.message)
        throw new ForbiddenException(error.message)
      }
      if (error.code === 'P2025' || error.status === 404) {
        this.logger.error(error.message)
        throw new NotFoundException(error.message)
      }
      this.logger.error(error)
      throw new Error(error.message)
    }
  }

  async getSubscription(accountId: string) {
    try {
      const subscription = await this.prisma.subscription.findUniqueOrThrow({
        where: { accountId },
        select: {
          status: true,
          billingFrequency: true
        }
      })
      this.logger.info(`Subscription for accountId ${accountId} found`)
      return subscription
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.error('Account not found')
        throw new NotFoundException('Account not found')
      }
      this.logger.error(error)
      throw new Error(error.message)
    }
  }
}
