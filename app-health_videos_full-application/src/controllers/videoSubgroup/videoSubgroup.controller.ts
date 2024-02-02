import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query
} from '@nestjs/common'
import { VideoSubgroupService } from './videoSubgroup.service'
import { CreateVideoSubgroupDto } from './dto/createVideoSubgroup.dto'
import { UpdateVideoSubgroupDto } from './dto/updateVideoSubgroup.dto'
import { routes } from '@src/common/baseRoutes'

@Controller(routes.videoSubgroup)
export class VideoSubgroupController {
  constructor(private readonly videoSubgroupService: VideoSubgroupService) { }

  @Post()
  create(@Body() createVideoSubgroupDto: CreateVideoSubgroupDto) {
    return this.videoSubgroupService.create(createVideoSubgroupDto)
  }

  @Get()
  findAll(@Query() query: Partial<CreateVideoSubgroupDto>) {
    return this.videoSubgroupService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.videoSubgroupService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateVideoSubgroupDto: UpdateVideoSubgroupDto
  ) {
    return this.videoSubgroupService.update(id, updateVideoSubgroupDto)
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.videoSubgroupService.remove(id)
  }
}
