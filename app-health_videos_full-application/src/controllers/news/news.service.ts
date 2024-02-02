import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsRequestDto } from './dto/create-news-request.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from '@src/database/prisma.service';
import { CreateNewsResponseDto, CreateNewsResponsePlaylistDto } from './dto/create-news-response.dto';
import { FindLastNewsResponseDto } from './dto/find-last-news.response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NewsService {
  private readonly cdnAddress: string;

  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.cdnAddress = this.configService.get<string>('CDN_ADDRESS');
  }

  async create(createNewsDto: CreateNewsRequestDto): Promise<CreateNewsResponseDto> {
    const releaseDate = createNewsDto.release ? new Date(createNewsDto.release) : new Date();

    const createPlaylists = createNewsDto.playlists.map((playlistDto) => {
      return {
        thumb: playlistDto.thumb,
        status: "ACTIVE",
        release: playlistDto.release ? new Date(playlistDto.release) : releaseDate,
        public: false,
        playlistId: playlistDto.id,
      }
    })

    const createdNews = await this.prisma.news.create({
      data: {
        name: createNewsDto.name,
        release: releaseDate,
        createdAt: new Date(),
        public: false,
        news: {
          createMany: {
            data: createPlaylists
          }
        }
      },
      include: {
        news: {
          include: {
            playlist: {
              select: {
                id: true,
                name: true,
                categoryId: true,
              }
            },
          }
        },
      }
    })

    const responseDto: CreateNewsResponseDto = this.toCreateNewsResponseDto(createdNews);

    return responseDto;
  }

  async findLast(): Promise<FindLastNewsResponseDto[]> {
    const news: any[] = await this.prisma.$queryRaw`
      SELECT
        n."id",
        n."name",
        n."release",
        n."createdAt",
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'newsId', pon."newsId",
            'playlistId', pon."playlistId",
            'thumb', pon."thumb",
            'categoryTitle', c."title",
            'categoryIcon', c."icon"
          )
        ) as news
      FROM "News" n
        JOIN "PlaylistsOnNews" pon ON n."id" = pon."newsId"
        JOIN "Playlist" p ON pon."playlistId" = p."id"
        LEFT JOIN "Category" c ON p."categoryId" = c."id"
        WHERE n."public" = true AND pon."public" = true
      GROUP BY n."id"
      ORDER BY n."createdAt" DESC;
    `;

    if (news.length == 0) {
      throw new NotFoundException('No news registered yet.');
    }

    const responseDto: FindLastNewsResponseDto[] = this.toFindLastNewsResponseDto(news[0]);

    return responseDto;
  }

  findAll() {
    return `This action returns all news`;
  }

  findOne(id: number) {
    return `This action returns a #${id} news`;
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }

  private toCreateNewsResponseDto(rawEntity: any): CreateNewsResponseDto {
    const playlistsDto: CreateNewsResponsePlaylistDto[] = rawEntity.news.map((newsPlaylist) => {
      return {
        playlistId: newsPlaylist.playlistId,
        name: newsPlaylist.playlist.name,
        thumb: newsPlaylist.thumb?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
        release: newsPlaylist.release,
        categoryId: newsPlaylist.playlist.categoryId,
      }
    })

    const newsDto: CreateNewsResponseDto = {
      id: rawEntity.id,
      name: rawEntity.name,
      release: rawEntity.release,
      createdAt: rawEntity.createdAt,
      playlists: playlistsDto,
    }

    return newsDto;
  }

  private toFindLastNewsResponseDto(rawEntity: any): FindLastNewsResponseDto[] {
    const lastNewsDto: FindLastNewsResponseDto[] = rawEntity.news.map((news) => {
      const newsDto: FindLastNewsResponseDto = {
        newsId: news.newsId,
        playlistId: news.playlistId,
        thumb: news.thumb?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
        categoryName: news.categoryTitle,
        categoryIcon: news.categoryIcon?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
      }

      return newsDto;
    })

    return lastNewsDto;
  }
}
