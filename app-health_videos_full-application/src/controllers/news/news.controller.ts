import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsRequestDto } from './dto/create-news-request.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiTags } from '@nestjs/swagger';
import { routes } from '@src/common/baseRoutes';
import { CreateNewsResponseDto } from './dto/create-news-response.dto';
import { FindLastNewsResponseDto } from './dto/find-last-news.response.dto';

@Controller(routes.news)
@ApiTags('News')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createNewsDto: CreateNewsRequestDto): Promise<CreateNewsResponseDto> {
    return this.newsService.create(createNewsDto);
  }

  @Get('/last')
  findLast(): Promise<FindLastNewsResponseDto[]> {
    return this.newsService.findLast();
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
