import { Module } from '@nestjs/common'
import { AccountCategoryInterestsService } from './account-category-interests.service'
import { PrismaService } from '@src/database/prisma.service'
import { VideoCategoryService } from '../video-category/video-category.service'
import { PrismaModule } from '@src/database/prisma.module'

@Module({
  providers: [
    AccountCategoryInterestsService,
    PrismaService,
    VideoCategoryService
  ],
  imports: [PrismaModule]
})
export class AccountCategoryInterestsModule {}
