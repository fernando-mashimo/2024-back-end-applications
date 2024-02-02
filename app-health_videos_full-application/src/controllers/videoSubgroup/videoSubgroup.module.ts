import { Module } from '@nestjs/common';
import { VideoSubgroupService } from './videoSubgroup.service';
import { VideoSubgroupController } from './videoSubgroup.controller';
import { PrismaModule } from '@src/database/prisma.module';

@Module({
  controllers: [VideoSubgroupController],
  providers: [VideoSubgroupService],
  imports: [PrismaModule],
})
export class VideoSubgroupModule {}
