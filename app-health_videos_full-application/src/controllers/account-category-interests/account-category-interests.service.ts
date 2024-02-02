import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@src/database/prisma.service'
import { pino } from 'pino'
import { VideoCategoryService } from '../video-category/video-category.service'

@Injectable()
export class AccountCategoryInterestsService {
  private readonly logger = pino()
  constructor(
    private readonly prisma: PrismaService,
    private readonly videoCategoryService: VideoCategoryService
  ) {}
  async createOrUpdate(
    interests: string[],
    accountId: string,
    accountDetailsId: string
  ) {
    try {
      this.logger.info('Initiating account category interests info update...')
      await this.verifyAllCategoryExists(interests)
      await this.prisma.accountCategoryInterests.deleteMany({
        where: {
          accountDetailsId
        }
      })
      await this.prisma.accountCategoryInterests.createMany({
        data: interests.map((categoryId) => ({
          accountDetailsId,
          categoryId
        }))
      })
    } catch (error) {
      if (error instanceof BadRequestException) {
        this.logger.error(error.message)
        throw new BadRequestException(error)
      }
      this.logger.error(error.message)
      throw new Error(error)
    }
  }

  async verifyAllCategoryExists(categoryIds: string[]) {
    try {
      this.logger.info('Verifying if all categories exist...')
      const allCategoriesExists = categoryIds.every(async (categoryId) => {
        const foundCategory =
          await this.videoCategoryService.findOne(categoryId)
        if (!foundCategory) {
          return false
        }
        return true
      })
      if (!allCategoriesExists) {
        throw new BadRequestException('One or more categories do not exist')
      }
      this.logger.info('All categories exist')
      return allCategoriesExists
    } catch (error) {
      this.logger.error(error.message)
      throw new Error(error)
    }
  }
}
