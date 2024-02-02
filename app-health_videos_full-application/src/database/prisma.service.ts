import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import pino from 'pino';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = pino();

  async onModuleInit() {
    await this.$connect()
    this.logger.info(`DB connection opened.`)
    // @ts-ignore
    this.$on('query', async (e) => {
      // @ts-ignore
      this.logger.info(`${e.query} ${e.params}`)
    })
  }
}
