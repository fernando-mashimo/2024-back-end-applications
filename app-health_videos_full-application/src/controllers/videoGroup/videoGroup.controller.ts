import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  ValidationPipe,
  UsePipes
} from '@nestjs/common'
import { VideoGroupService } from './videoGroup.service'
import { CreateVideoGroupDto, UpdateVideoGroupDto } from './dto/'
import { FindVideoGroupDto } from './dto/findVideoGroup.dto'
import { routes } from '@src/common/baseRoutes'

@Controller(routes.videoGroup)
export class VideoGroupController {
  constructor(private readonly videoGroupService: VideoGroupService) { }

  @Post()
  create(@Body() createVideoGroupDto: CreateVideoGroupDto) {
    return this.videoGroupService.create(createVideoGroupDto)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  findAll(@Query() query: FindVideoGroupDto) {
    return this.videoGroupService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.videoGroupService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateVideoGroupDto: UpdateVideoGroupDto
  ) {
    return this.videoGroupService.update(id, updateVideoGroupDto)
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.videoGroupService.remove(id)
  }
}
