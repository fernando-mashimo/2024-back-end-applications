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
import { PlaylistService } from './playlist.service'
import { CreatePlaylistDto, FindAllPlaylistDto, UpdatePlaylistDto } from './dto'
import { routes } from '@src/common/baseRoutes'
import { ApiTags } from '@nestjs/swagger'
import { AuthenticatedAccount } from '@src/helpers/authenticated-user'
import { Authentication } from '../auth/jwt-entities/authentication'

@Controller(routes.playlist)
@ApiTags('Video playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) { }

  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.create(createPlaylistDto)
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() query: FindAllPlaylistDto) {
    return this.playlistService.findAll(query)
  }

  @Get(':id/videos')
  @UsePipes(new ValidationPipe({ transform: true }))
  findAllVideos(
    @AuthenticatedAccount() authentication: Authentication,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.playlistService.findPlaylistVideos(id, authentication);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.playlistService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto
  ) {
    // return this.playlistService.update(id, updatePlaylistDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistService.remove(id)
  }
}
