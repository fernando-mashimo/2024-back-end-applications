import { Module } from '@nestjs/common';
import { VideoCategoryService } from './video-category.service';
import { VideoCategoryController } from './video-category.controller';
import { PrismaModule } from '@src/database/prisma.module';

@Module({
  controllers: [VideoCategoryController],
  providers: [VideoCategoryService],
  imports: [PrismaModule],
})
export class VideoCategoryModule {}
