import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { CreateVideoCategoryDto } from './dto/create-video-category.dto'
import { UpdateVideoCategoryDto } from './dto/update-video-category.dto'
import { PrismaService } from '@src/database/prisma.service'
import { NotFound } from 'src/errors'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { FindCategoryPlaylistResponseDto } from './dto/find-category-playlists-response.dto'
import { FindCategoryShortsRequestDto } from './dto/find-category-shorts-request.dto'
import { makePagination } from '@src/helpers/makePagination'
import { FindCategoryShortsResponseDto } from './dto/find-category-shorts-response.dto'
import pino from 'pino'
import { FindCategoryIntrosResponseDto } from './dto/find-category-intros-response.dto'
import { FindCategoryIntrosQuery } from './entities/find-category-intros.entity'
import { FindCategoryShortsQuery } from './entities/find-category-shorts.entity'
import { Category } from './entities/category.entity'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class VideoCategoryService {
  private readonly cdnAddress: string;
  private readonly logger = pino();

  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.cdnAddress = this.configService.get<string>('CDN_ADDRESS');
  }

  async create(createVideoCategoryDto: CreateVideoCategoryDto) {
    const createdCategory = await this.prisma.category
      .create({
        data: {
          title: createVideoCategoryDto.title,
          description: createVideoCategoryDto.description,
          icon: createVideoCategoryDto.icon,
          thumbPortrait: createVideoCategoryDto.thumbPortrait,
          thumbLandscape: createVideoCategoryDto.thumbLandscape,
          public: false,
        }
      })
      .catch((error) => {
        this.logger.error(error)
        throw new InternalServerErrorException('Error creating video category')
      })
    return createdCategory
  }

  async findAll() {
    const categories: any[] = await this.prisma.category.findMany({
      where: {
        public: true,
      }
    })

    return categories.map((c) => this.toCategoryEntity(c))
  }

  async findCategoryIntros(): Promise<FindCategoryIntrosResponseDto[]> {
    const categoryIntros: FindCategoryIntrosQuery[] = await this.prisma.$queryRaw`
      SELECT
        DISTINCT ON (c."id")
        c."id",
        c."title",
        c."icon",
        v."id" as "videoId",
        v."name" as "videoName",
        v."link" as "videoLink",
        v."videoType" as "videoType"
      FROM "Category" c
        JOIN "Video" v ON v."categoryId" = c."id"
      WHERE v."videoType" = 'INTRO' AND c."public" = true::BOOLEAN
      ORDER BY c."id", v."id";
    `;

    return categoryIntros.map((row) => this.toFindCategoryIntrosResponseDto(row));
  }

  async findOne(id: string) {
    const category = await this.prisma.category
      .findFirst({
        where: { id }
      })
      .then((res) => {
        if (!res) {
          this.logger.error('One or more categories not found.')
          throw new NotFoundException('One or more categories not found.')
        } else {
          return res
        }
      })

    return category
  }

  async findCategoryPlaylists(id: string): Promise<FindCategoryPlaylistResponseDto[]> {
    const existsCategory = await this.prisma.category.findUnique({
      where: {
        id: id
      }
    })

    if (!existsCategory) {
      this.logger.error(`Find category playlists. Resource categoryId=${id} not found.`)
      throw new NotFound(`Resource category=${id} does not exist.`)
    }

    const categoryPlaylists: any[] = await this.prisma.$queryRaw`
      SELECT
        p."id",
        p."name",
        p."description",
        p."thumb",
        (
          SELECT COUNT(*)
          FROM "VideoSubgroupVideo" vsv
          JOIN "Video" v ON vsv."videoId" = v.id
          JOIN "VideoSubgroup" vs ON vsv."videoSubgroupId" = vs.id
          LEFT JOIN "VideoGroup" vg ON vs."videoGroupId" = vg.id
          WHERE vg."playlistId" = p."id"
        )::int AS total_videos -- ':: int AS' converts the result of this to int
      FROM "Playlist" p
      WHERE p."public" = true::BOOLEAN AND p."categoryId" = CAST(${id} AS UUID); -- 'CAST(## AS UUID)' casts this string to UUID before searching
    `;

    const responseDto: FindCategoryPlaylistResponseDto[] = categoryPlaylists.map((playlist) => this.toFindCategoryPlaylistsResponseDto(playlist));

    return responseDto;
  }

  async findCategoryShorts(
    id: string,
    { itemPerPage, pageNumber }: FindCategoryShortsRequestDto,
  ): Promise<FindCategoryShortsResponseDto[]> {
    const existsCategory = await this.prisma.category.findUnique({
      where: {
        id: id
      }
    })

    if (!existsCategory) {
      this.logger.error(`Find category playlists. Resource categoryId=${id} not found.`)
      throw new NotFound(`Resource category=${id} does not exist.`)
    }

    const { skip, take } = makePagination(pageNumber, itemPerPage);

    const shorts: FindCategoryShortsQuery[] = await this.prisma.$queryRaw`
      SELECT
        v."id",
        v."name",
        v."link"
      FROM "Video" v
      WHERE v."categoryId" = CAST(${id} AS UUID) AND v."videoType" = 'SHORT'
      ORDER BY RANDOM()
      OFFSET ${skip}
      LIMIT ${take}
    `;

    const mappedShorts: FindCategoryShortsResponseDto[] = shorts.map((short) => this.toFindCategoryShortsResponseDto(short))

    return mappedShorts;
  }

  async update(id: string, updateVideoCategoryDto: UpdateVideoCategoryDto) {
    this.logger.info(updateVideoCategoryDto)
    const category = this.prisma.category
      .update({
        data: updateVideoCategoryDto,
        where: { id }
      })
      .catch((error: PrismaClientKnownRequestError) => {
        const notFountMessage = 'Record to update not found.'

        const { cause } = error.meta

        if (notFountMessage === cause) {
          throw new NotFound(cause)
        }

        throw new InternalServerErrorException(
          'Something went wrong with the update'
        )
      })
    return category
  }

  async remove(id: string) {
    const deletedCategory = await this.prisma.category
      .delete({
        where: { id }
      })
      .catch((error: PrismaClientKnownRequestError) => {
        const notFountMessage = 'Record to delete not found.'
        const { cause } = error.meta
        if (notFountMessage === cause) {
          throw new NotFound(cause)
        }
        throw new InternalServerErrorException(
          'Something went wrong with the delete'
        )
      })

    this.logger.info(`Categoria de vídeo #${id} removida:`, deletedCategory)
    return id
  }

  private toFindCategoryPlaylistsResponseDto(rawPlaylistEntity: any): FindCategoryPlaylistResponseDto {
    const categoryPlaylistDto: FindCategoryPlaylistResponseDto = {
      id: rawPlaylistEntity.id,
      name: rawPlaylistEntity.name,
      description: rawPlaylistEntity.description,
      thumb: rawPlaylistEntity.thumb?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
      categoryId: rawPlaylistEntity.categoryId,
      totalVideos: rawPlaylistEntity.total_videos,
    }

    return categoryPlaylistDto;
  }

  private toFindCategoryShortsResponseDto(rawVideoEntity: FindCategoryShortsQuery): FindCategoryShortsResponseDto {
    const shortDto: FindCategoryShortsResponseDto = {
      id: rawVideoEntity.id,
      name: rawVideoEntity.name,
      link: rawVideoEntity.link?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
    }

    return shortDto;
  }

  private toFindCategoryIntrosResponseDto(rawEntity: FindCategoryIntrosQuery): FindCategoryIntrosResponseDto {
    const introDto: FindCategoryIntrosResponseDto = {
      id: rawEntity.id,
      title: rawEntity.title,
      icon: rawEntity.icon?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
      video: {
        id: rawEntity.videoId,
        name: rawEntity.videoName,
        link: rawEntity.videoLink?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
        type: rawEntity.videoType,
      }
    }

    return introDto;
  }

  private toCategoryEntity(rawEntity: any): Category {
    const category: Category = {
      id: rawEntity.id,
      title: rawEntity.title,
      description: rawEntity.description,
      icon: rawEntity.icon?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
      thumbPortrait: rawEntity.thumbPortrait?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
      thumbLandscape: rawEntity.thumbLandscape?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
    }

    return category;
  }
}
