import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateVideoCategoryDto } from './dto/create-video-category.dto';
import { UpdateVideoCategoryDto } from './dto/update-video-category.dto';
import { VideoCategoryService } from './video-category.service';
import { routes } from '@src/common/baseRoutes';
import { ApiTags } from '@nestjs/swagger';
import { FindCategoryShortsRequestDto } from './dto/find-category-shorts-request.dto';
import { FindCategoryShortsResponseDto } from './dto/find-category-shorts-response.dto';
import { FindCategoryPlaylistResponseDto } from './dto/find-category-playlists-response.dto';
import { FindCategoryIntrosResponseDto } from './dto/find-category-intros-response.dto';

@Controller(routes.category)
@ApiTags('Video category')
export class VideoCategoryController {
  constructor(private readonly videoCategoryService: VideoCategoryService) { }

  @Post()
  create(@Body() createVideoCategoryDto: CreateVideoCategoryDto) {
    return this.videoCategoryService.create(createVideoCategoryDto);
  }

  @Get()
  findAll() {
    return this.videoCategoryService.findAll();
  }

  @Get('/intro')
  findCategoriesIntro(): Promise<FindCategoryIntrosResponseDto[]> {
    return this.videoCategoryService.findCategoryIntros();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.videoCategoryService.findOne(id);
  }

  @Get(':id/playlists')
  findCategoryPlaylists(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<FindCategoryPlaylistResponseDto[]> {
    return this.videoCategoryService.findCategoryPlaylists(id);
  }

  @Get(':id/shorts')
  @UsePipes(new ValidationPipe({ transform: true }))
  findCategoryShorts(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Query() query: FindCategoryShortsRequestDto,
  ): Promise<FindCategoryShortsResponseDto[]> {
    return this.videoCategoryService.findCategoryShorts(id, query);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateVideoCategoryDto: UpdateVideoCategoryDto) {
    return this.videoCategoryService.update(id, updateVideoCategoryDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {

    return this.videoCategoryService.remove(id);
  }
}
