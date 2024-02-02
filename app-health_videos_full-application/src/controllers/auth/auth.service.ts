import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { AccountService } from '../account/account.service'
import { compareSync, hashSync } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { env } from 'process'
// import { ChangePasswordDto } from './dto/change-passwotd.dto'
// import { UpdateAccountDto } from '../account/dto/update-account.dto'
import pino from 'pino'
import { PrismaService } from '@src/database/prisma.service'
import { LoginDto } from './dto/login-request.dto'
import { LoginResponseDto } from './dto/login-response.dto'
import { ConfigService } from '@nestjs/config'
import { RefreshDto } from './dto/refresh-request.dto'
import { v4 as uuidv4 } from 'uuid';
import { AccessJwtPayload, AccessJwtSubscriptionType } from './jwt-entities/access-jwt-payload.entity'
import { RefreshJwtPayload } from './jwt-entities/refresh-jwt-payload.entity'
import { Account as AccountEntity } from '../account/entities/account.entity'
import { JwtPair } from './jwt-entities/jwt-pair.entity'
import { RefreshResponseDto } from './dto/refresh-response.dto'
import { AccountAuth, QueryAccountAuth } from './jwt-entities/account-auth.entity'

@Injectable()
export class AuthService {
  private readonly logger = pino()
  private readonly refreshTokenExpiration: number;
  private readonly accessTokenExpiration: number;
  private readonly refreshTokenSecret: string;
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiration = this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_IN_MINUTES');
    this.refreshTokenExpiration = this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_IN_DAYS');
    this.refreshTokenSecret = this.configService.get<string>('JWT_REFRESH_SECRET_KEY');
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const email = loginDto.email;
    // const account = await this.accountService.getAccountByEmail(email) as AccountEntity;
    const account = await this.getAccountAuthByEmail(email);

    if (!account) {
      this.logger.info(
        `User authentication. Account of email=${email} not found.`
      )
      throw new UnauthorizedException(
        `Login exception. Email or password incorrect.`
      )
    }

    const isPasswordValid = compareSync(loginDto.password, account.password)

    if (!isPasswordValid) {
      this.logger.warn(
        `User authentication. Password invalid for user of email=${email}`
      )
      throw new UnauthorizedException(
        `Login exception. Email or password incorrect.`
      )
    }

    const jwtPair = await this.generateJwtPair(account);

    if (!jwtPair) {
      this.logger.error(`Login request. Error while generating jwt pair for user of email=${email}`)
      throw new InternalServerErrorException(
        'Login not successful - some error has occurred'
      )
    }

    await this.persistRefreshToken(jwtPair.refreshToken, account.id)
    this.logger.info(
      `Login request. User of email=${email} has succesfully authenticated themselves.`
    )

    const responseDto: LoginResponseDto = {
      accountId: account.id,
      accessToken: jwtPair.accessToken,
      refreshToken: jwtPair.refreshToken
    }

    return responseDto
  }

  async refreshAuthentication(refreshDto: RefreshDto): Promise<RefreshResponseDto> {
    const isJwtValid = this.isJwtSignedAndNotExpired(refreshDto.refreshToken);

    if (!isJwtValid) {
      throw new UnauthorizedException(`Refresh Token is expired or invalid.`);
    }

    const existsAccountByRefresh = await this.existsAccountAuthByRefreshToken(refreshDto.refreshToken);

    if (!existsAccountByRefresh) {
      throw new UnauthorizedException(`Refresh Token is expired or invalid.`);
    }

    const jwtPair = await this.generateJwtPair(existsAccountByRefresh);

    await this.persistRefreshToken(jwtPair.refreshToken, existsAccountByRefresh.id);

    return jwtPair;
  }

  // async changePassword(id: string, dto: ChangePasswordDto) {
  //   try {
  //     const acc = await this.accountService.findOne(id)
  //     const isPasswordValid = compareSync(dto.oldPassword, acc.password)
  //     if (!isPasswordValid) throw new UnauthorizedException()

  //     const hashedPassword = hashSync(dto.newPassword, 10)

  //     const updateAcc = new UpdateAccountDto()
  //     updateAcc.password = hashedPassword

  //     this.accountService.changePasswword(updateAcc, id)
  //   } catch (error) {
  //     if (error.status === 401)
  //       throw new UnauthorizedException('Invalid password')
  //     throw new Error(error)
  //   }
  // }

  async logout(accountId: string) {
    try {
      const deletedTokenAccount = await this.prisma.refreshToken.delete({
        where: { accountId },
        select: { accountId: true }
      })
      this.logger.info(`Logout successful for accountId=${accountId}`)
      return deletedTokenAccount
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.error(
          `Logout Failed. Account with id=${accountId} not found.`
        )
        throw new NotFoundException('Logout failed due to data mismatch')
      }
      throw new Error('Logout failed')
    }
  }

  async getRefreshToken(accountId: string) {
    const token = await this.prisma.refreshToken.findUnique({
      where: { accountId }
    })

    if (!token) {
      this.logger.error(`Refresh Token for accountId=${accountId} not found.`)
      throw new NotFoundException(`Refresh Token not found.`)
    }

    this.logger.info(
      `Refresh Token for account=${accountId} found Refresh=${JSON.stringify(
        token
      )}`
    )
    return token.refreshToken // TODO: return refresh inside an object
  }

  private async persistRefreshToken(refreshToken: string, accountId: string): Promise<void> {
    try {
      const iat = new Date()
      const expirationDate = new Date(iat)
      expirationDate.setDate(iat.getDate() + this.refreshTokenExpiration)

      const refreshTokenData = {
        accountId,
        refreshToken,
        iat,
        expirationDate
      }

      await this.prisma.refreshToken.upsert({
        where: { accountId },
        create: refreshTokenData,
        update: refreshTokenData
      })
    } catch (error) {
      this.logger.error(`Error occured while persisting refresh token for account of id=${accountId}. Error=${JSON.stringify(error)}`)
      throw new Error(error)
    }
  }

  private async generateJwtPair(account: AccountAuth): Promise<JwtPair> {
    const accountId = account.id;

    const accessJti = uuidv4();

    const subscriptionType = account.subscriptionBillingFrequency == 'free'
      ? AccessJwtSubscriptionType.FREEMIUM
      : AccessJwtSubscriptionType.SUBSCRIBER;

    const accessJwtPayload: AccessJwtPayload = {
      jti: accessJti,
      sub: accountId,
      email: account.email,
      subscription: subscriptionType,
    }

    const refreshJti = uuidv4();

    const refreshJwtPayload: RefreshJwtPayload = {
      jti: refreshJti,
      sub: accountId,
    }

    const accessToken = this.jwtService.sign(
      { ...accessJwtPayload },
      {
        secret: env.JWT_SECRET_KEY,
        expiresIn: `${this.accessTokenExpiration}m`
      }
    )

    const refreshToken = this.jwtService.sign(
      { ...refreshJwtPayload },
      {
        secret: env.JWT_REFRESH_SECRET_KEY,
        expiresIn: `${this.refreshTokenExpiration}d`
      }
    )

    const jwtPair: JwtPair = {
      accessToken,
      refreshToken,
    }

    this.logger.info(`Auth Service. Successfully signed access and refresh JWTs for account of id=${accountId}.`)
    return jwtPair
  }

  private isJwtSignedAndNotExpired(jwt: string): object | boolean {
    try {
      return this.jwtService.verify(jwt, { secret: this.refreshTokenSecret });
    } catch (error) {
      this.logger.error(`JWT verification failed: ${error.message}`);
      return false;
    }
  }

  private async getAccountAuthByEmail(email: string) {
    const queryAccountByEmail: QueryAccountAuth[] = await this.prisma.$queryRaw`
      SELECT
        a."id",
        a."cpf",
        a."email",
        a."password",
        a."accountType",
        s."billingFrequency",
        s."status"
      FROM "Account" a
        left JOIN "Subscription" s ON a."id" = s."accountId"
      WHERE a."email" = ${email};
    `;

    const existsAccount = queryAccountByEmail[0];

    const accountAuth: AccountAuth = existsAccount
      ? this.toAccountAuthEntity(existsAccount)
      : null;

    return accountAuth;
  }

  private async existsAccountAuthByRefreshToken(refreshToken: string) {
    const queryAccountByRefreshToken: QueryAccountAuth[] = await this.prisma.$queryRaw`
      SELECT
        a."id",
        a."cpf",
        a."email",
        a."password",
        a."accountType",
        s."billingFrequency",
        s."status"
      FROM "RefreshToken" r
        JOIN "Account" a ON r."accountId" = a."id"
        LEFT JOIN "Subscription" s ON a."id" = s."accountId"
      WHERE r."refreshToken" = ${refreshToken};
    `;

    const existsAccount = queryAccountByRefreshToken[0];

    const accountAuth: AccountAuth = existsAccount
      ? this.toAccountAuthEntity(existsAccount)
      : null;

    return accountAuth;
  }

  private toAccountAuthEntity(account: QueryAccountAuth) {
    const accountAuthEntity: AccountAuth = {
      id: account.id,
      cpf: account.cpf,
      email: account.email,
      password: account.password,
      type: account.accountType,
      subscriptionBillingFrequency: account.billingFrequency,
      subscriptionStatus: account.status,
    }

    return accountAuthEntity;
  }
}
