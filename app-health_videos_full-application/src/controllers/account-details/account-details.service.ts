import { Injectable } from '@nestjs/common'
import { PrismaService } from '@src/database/prisma.service'
import pino from 'pino'

@Injectable()
export class AccountDetailsService {
  private readonly logger = pino()
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdate(
    attributeName: string,
    attributeValues: string[],
    accountId: string
  ) {
    try {
      this.logger.info(
        'Initiating account objectives and/or medical restrictions info update...'
      )
      const updateObject: Record<string, any> = {}
      updateObject[attributeName] = { set: attributeValues }

      const newAccountDetails = await this.prisma.accountDetails.upsert({
        where: { accountId },
        update: updateObject,
        create: {
          accountId,
          [attributeName]: attributeValues
        }
      })
      return newAccountDetails
    } catch (error) {
      this.logger.error(error.message)
      throw new Error(error)
    }
  }
}
