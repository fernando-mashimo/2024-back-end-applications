import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AccountModule } from '../account/account.module'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './stategies/jwt.strategy'
import { PrismaModule } from '@src/database/prisma.module'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyModule } from './api-key/api-key.module'

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot(),
    AccountModule,
    PassportModule,
    ApiKeyModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
    JwtStrategy,
  ],
  controllers: [AuthController]
})
export class AuthModule { }
