import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { CreatePasswordResetTokenDto } from './dto/create-password-reset-token.dto'
import { PasswordResetToken } from './entities/password-reset-token.entity'
import pino from 'pino'
import { PrismaService } from '@src/database/prisma.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PasswordResetTokensService {
  private readonly logger = pino()
  private readonly passwordResetTokenExpiration: number

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.passwordResetTokenExpiration = this.configService.get<number>(
      'PASSWORD_RESET_TOKEN_EXPIRATION_IN_MINUTES'
    )
  }
  async createToken(
    createPasswordResetTokenDto: CreatePasswordResetTokenDto
  ): Promise<PasswordResetToken> {
    try {
      this.logger.info('Initiating token generation process...')
      const { accountId } = createPasswordResetTokenDto

      // altera todos os tokens gerados anteriormente para isUsed = true
      await this.prisma.passwordResetTokens.updateMany({
        where: {
          accountId,
          isUsed: false
        },
        data: {
          isUsed: true
        }
      })
      this.logger.info(
        `Successfully invalidated previously generated tokens for account ${accountId}`
      )

      const token = Math.floor(100000 + Math.random() * 900000)
      const createdAt = new Date(Date.now())
      const expiresAt = new Date(
        createdAt.getTime() + this.passwordResetTokenExpiration * 60 * 1000
      )
      const data = {
        accountId,
        token,
        createdAt,
        expiresAt,
        isUsed: false
      }
      const newToken = await this.prisma.passwordResetTokens.create({ data })
      this.logger.info('New token successfully generated.')
      return newToken
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.error(error.message)
        throw new NotFoundException(error)
      }
      this.logger.error(error.message)
      throw new InternalServerErrorException(error)
    }
  }

  async findToken(accountId: string): Promise<PasswordResetToken> {
    this.logger.info(`Fetching token from database for account ${accountId}...`)
    const token = await this.prisma.passwordResetTokens.findFirst({
      where: {
        accountId,
        isUsed: false
      }
    })
    if (!token) {
      this.logger.error('Token not found')
      throw new NotFoundException('Token not found')
    }
    this.logger.info('Token successfully fetched')
    return token
  }

  async setTokenAsUsed(accountId: string) {
    try {
      this.logger.info('Setting token as used in database...')
      await this.prisma.passwordResetTokens.updateMany({
        where: {
          accountId,
          isUsed: false
        },
        data: {
          isUsed: true
        }
      })
      this.logger.info('Token successfully set as used.')
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.error(error.message)
        throw new NotFoundException(error)
      }
      this.logger.error(error.message)
      throw new InternalServerErrorException(error)
    }
  }
}
