import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateWatchedVideoDto } from './dto/create-watched-video-request.dto';
import { FindVideoWatchedDto } from './dto/find-watched-video-history-request.dto';
import { VideoWatchedService } from './video-watched.service';
import { routes } from '@src/common/baseRoutes';
import { ApiTags } from '@nestjs/swagger';
import { CreateWatchedVideoResponseDto } from './dto/create-watched-video-response.dto';
import { VideoHistoryResponseDto } from './dto/find-watched-video-history-response.dto';
import { KeepWatchingLastVideosResponseDto } from './dto/keep-watching-response.dto';

@Controller({
  path: routes.history,
  version: '1',
})
@ApiTags('User video history')
export class VideoWatchedController {
  constructor(private readonly videoWatchedService: VideoWatchedService) { }

  @Post('video/:videoId')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Param('accountId', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @Param('videoId', new ParseUUIDPipe({ version: '4' })) videoId: string,
    @Body() createVideoWatchedDto: CreateWatchedVideoDto,
  ): Promise<CreateWatchedVideoResponseDto> {
    return this.videoWatchedService.create(accountId, videoId, createVideoWatchedDto);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/video')
  findAllByAccountId(
    @Param('accountId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() query: FindVideoWatchedDto
  ): Promise<VideoHistoryResponseDto[]> {
    return this.videoWatchedService.findAllByAccountId(id, query);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/video/keep-watching')
  keepWatchingLastVideo(
    @Param('accountId', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @Query() query: FindVideoWatchedDto
  ): Promise<KeepWatchingLastVideosResponseDto[]> {
    return this.videoWatchedService.keepWatchingLastVideos(accountId, query);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/video/:id')
  findOne(
    @Param('accountId', new ParseUUIDPipe({ version: '4' })) accountId: string,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.videoWatchedService.findOne(accountId, id);
  }
}
