import { Module } from '@nestjs/common'
import { AccountModule } from './controllers/account/account.module'
// import { DeviceModule } from './controllers/device/device.module'
import { PlanModule } from './controllers/plan/plan.module'
import { PlaylistModule } from './controllers/playlist/playlist.module'
import { SubscriptionModule } from './controllers/subscription/subscription.module'
import { VideoModule } from './controllers/video/video.module'
import { VideoGroupModule } from './controllers/videoGroup/videoGroup.module'
import { VideoSubgroupModule } from './controllers/videoSubgroup/videoSubgroup.module'
import { VideoCategoryModule } from './controllers/video-category/video-category.module'
import { VideoWatchedModule } from './controllers/video-watched/video-watched.module'
import { PaymentModule } from './controllers/payment/payment.module'
import { HealthcheckModule } from './controllers/healthcheck/healthcheck.module'
import { AuthModule } from './controllers/auth/auth.module'
import { WebhookModule } from './controllers/webhook/webhook.module'
import { NewsModule } from './controllers/news/news.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './controllers/auth/guards/jwt-auth.guard'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './database/prisma.module'
import { ProfessionalModule } from './controllers/professional/professional.module'
import { ApiKeyModule } from './controllers/auth/api-key/api-key.module'
import { PasswordResetTokensModule } from './controllers/password-reset-tokens/password-reset-tokens.module'
import { ThrottlerModule } from '@nestjs/throttler'

@Module({
  imports: [
    PrismaModule,
    VideoModule,
    PlaylistModule,
    AccountModule,
    SubscriptionModule,
    PlanModule,
    VideoGroupModule,
    VideoSubgroupModule,
    // DeviceModule,
    VideoCategoryModule,
    VideoWatchedModule,
    PaymentModule,
    HealthcheckModule,
    AuthModule,
    WebhookModule,
    NewsModule,
    ApiKeyModule,
    ProfessionalModule,
    PasswordResetTokensModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60
      }
    ])
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard
    // }
  ]
})
export class AppModule {}
