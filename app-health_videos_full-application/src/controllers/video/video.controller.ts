import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe
} from '@nestjs/common'
import { VideoService } from './video.service'
import { CreateVideoListDto, FindVideoDto, UpdateVideoDto } from './dto'
import { routes } from '@src/common/baseRoutes'
import { ApiTags } from '@nestjs/swagger'

@Controller(routes.video)
@ApiTags('Video')
export class VideoController {
  constructor(private readonly videoService: VideoService) { }

  @Post()
  create(@Body() createVideoListDto: CreateVideoListDto) {
    return this.videoService.create(createVideoListDto)
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() query: FindVideoDto) {
    return this.videoService.findAll(query)
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.videoService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateVideoDto: UpdateVideoDto
  ) {
    return this.videoService.update(id, updateVideoDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(id)
  }
}
