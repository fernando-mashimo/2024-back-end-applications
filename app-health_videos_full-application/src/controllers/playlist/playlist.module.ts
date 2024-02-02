import { Module } from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { PlaylistController } from './playlist.controller'
import { PrismaModule } from '@src/database/prisma.module'

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService],
  imports: [PrismaModule],
})
export class PlaylistModule {}
