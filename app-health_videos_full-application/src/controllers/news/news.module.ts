import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { PrismaModule } from '@src/database/prisma.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [PrismaModule]
})
export class NewsModule { }
