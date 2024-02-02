import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '@src/database/prisma.service'
import pino from 'pino'
import { ApiKey, ApiKeyStatus, VerifyApiKeyResponseDto } from './api-key.entity'

@Injectable()
export class ApiKeyService {
  private readonly logger = pino()

  constructor(private readonly prismaService: PrismaService) {}

  async verifyKey(key: string): Promise<VerifyApiKeyResponseDto> {
    const existsKey = (await this.prismaService.apiKeys.findUnique({
      where: {
        key
      }
    })) as ApiKey

    if (!existsKey || existsKey.status !== ApiKeyStatus.ACTIVE) {
      this.logger.warn(
        `Authentication. Api Key of key=${key}, holder=${JSON.stringify(
          existsKey?.holder ?? false
        )}, status=${JSON.stringify(existsKey?.status ?? false)}, valid=false`
      )
      throw new ForbiddenException('Invalid Api Key')
    }

    this.logger.info(
      `Authentication. Api Key of key=${key}, holder=${existsKey?.holder} valid=${true}`
    )
    return { isValid: true, holder: existsKey?.holder }
  }
}
