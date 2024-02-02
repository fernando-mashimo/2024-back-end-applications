import { Module } from '@nestjs/common';
import { VideoWatchedService } from './video-watched.service';
import { VideoWatchedController } from './video-watched.controller';
import { PrismaModule } from '@src/database/prisma.module';

@Module({
  controllers: [VideoWatchedController],
  providers: [VideoWatchedService],
  imports: [PrismaModule],
})
export class VideoWatchedModule {}
