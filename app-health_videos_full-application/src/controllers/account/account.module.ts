import { Module } from '@nestjs/common'
import { PrismaModule } from '@src/database/prisma.module'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'
import { AccountDetailsService } from '../account-details/account-details.service'
import { AccountCategoryInterestsService } from '../account-category-interests/account-category-interests.service'
import { VideoCategoryService } from '../video-category/video-category.service'
import { SubscriptionService } from '../subscription/subscription.service'
import { ApiKeyService } from '../auth/api-key/api-key.service'
import { PasswordResetTokensService } from '../password-reset-tokens/password-reset-tokens.service'
import { MailerService } from '@src/common/external-services/mailer.service'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    AccountDetailsService,
    AccountCategoryInterestsService,
    VideoCategoryService,
    SubscriptionService,
    ApiKeyService,
    PasswordResetTokensService,
    MailerService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [AccountService],
  imports: [PrismaModule]
})
export class AccountModule {}
