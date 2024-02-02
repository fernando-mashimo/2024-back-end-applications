import { Module } from '@nestjs/common';
import { VideoGroupService } from './videoGroup.service';
import { VideoGroupController } from './videoGroup.controller';
import { PrismaModule } from '@src/database/prisma.module';

@Module({
  controllers: [VideoGroupController],
  providers: [VideoGroupService],
  imports: [PrismaModule],
})
export class VideoGroupModule {}
