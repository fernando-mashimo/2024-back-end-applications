import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '@src/database/prisma.service';
import { NotFound } from 'src/errors';
import { makePagination } from 'src/helpers/makePagination';
import { CreateWatchedVideoDto } from './dto/create-watched-video-request.dto';
import { FindVideoWatchedDto } from './dto/find-watched-video-history-request.dto';
import { CreateWatchedVideoResponseDto } from './dto/create-watched-video-response.dto';
import { FindWatchedVideoHistoryResponseDto, HistoryDayEntryDto, VideoHistoryResponseDto } from './dto/find-watched-video-history-response.dto';
import { KeepWatchingLastVideosResponseDto } from './dto/keep-watching-response.dto';
import { FindKeepWatchingQuery } from './entities/find-keep-watching.entity';
import { ConfigService } from '@nestjs/config';

const notFoundCodes = ["P2003", "P2025"]

@Injectable()
export class VideoWatchedService {
  private readonly cdnAddress: string;

  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.cdnAddress = this.configService.get<string>('CDN_ADDRESS');
  }

  private readonly logger = new Logger(VideoWatchedService.name)

  async create(
    accountId: string,
    videoId: string,
    createVideoWatchedDto: CreateWatchedVideoDto,
  ): Promise<CreateWatchedVideoResponseDto> {
    const createdVideo = await this.prisma.watchedVideo.create({
      data: {
        watchedTimeInSecond: createVideoWatchedDto.watchedTimeInSecond,
        accountId: accountId,
        videoId: videoId,
      }
    }).catch((error: PrismaClientKnownRequestError) => {
      if (notFoundCodes.includes(error.code)) {
        this.logger.error(`Error 404. Resource accountId=${accountId} or videoId=${videoId} not found.`)
        throw new NotFound("Resource account or video does not exist.")
      }

      throw new InternalServerErrorException("Something went wrong while creating a watched video entry.")
    })

    const response = this.toCreateWatchedVideoResponseDto(createdVideo);

    this.logger.log(`Watched Video. Account=${response.accountId} watched video=${response.videoId}`);

    return response;
  }

  async findAllByAccountId(
    accountId: string,
    { itemPerPage, pageNumber }: FindVideoWatchedDto,
  ): Promise<VideoHistoryResponseDto[]> {
    const existsAccount = await this.existsAccountById(accountId);

    if (!existsAccount) {
      this.logger.log(`Find account video history. Account of id=${accountId} does not exist.`);
      throw new NotFoundException(`Account with id=${accountId} does not exist.`);
    }

    const { skip, take } = makePagination(pageNumber, itemPerPage);
    const history: VideoHistoryResponseDto[] = await this.prisma.$queryRaw`
      SELECT
        EXTRACT(YEAR from subquery."watchedAt") as year,
        EXTRACT(MONTH from subquery."watchedAt") as month,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', subquery."id",
            'watchedAt', subquery."watchedAt",
            'watchedTimeInSeconds', subquery."watchedTimeInSeconds",
            'video', JSON_BUILD_OBJECT(
              'id', subquery."videoId",
              'name', subquery."name",
              'thumb', subquery."thumb",
              'link', subquery."link"
            )
          )
        ) as day
      FROM
        (
          SELECT
            wv."id",
            wv."watchedAt",
            wv."watchedTimeInSecond" as "watchedTimeInSeconds",
            v."id" as "videoId",
            v."name",
            v."thumb",
            v."link"
          FROM "WatchedVideo" wv
          JOIN "Video" v ON v."id" = wv."videoId"
          WHERE wv."accountId" = CAST(${accountId} AS UUID)
          ORDER BY wv."watchedAt" DESC
          LIMIT ${take} OFFSET ${skip}
        ) subquery
      GROUP BY
        year, month
      ORDER BY
        year DESC, month DESC;
    `;

    return history.map((h) => this.mapHistoryResDtoReplaceThumbAndLink(h));
  }

  async keepWatchingLastVideos(
    accountId: string,
    { itemPerPage, pageNumber }: FindVideoWatchedDto,
  ) {
    const existsAccount = await this.existsAccountById(accountId);

    if (!existsAccount) {
      this.logger.log(`Find keep watching last videos history. Account of id=${accountId} does not exist.`);
      throw new NotFoundException(`Account with id=${accountId} does not exist.`);
    }

    const { skip, take } = makePagination(pageNumber, itemPerPage);
    const lastWatched: FindKeepWatchingQuery[] = await this.prisma.$queryRaw`
      SELECT
        wv."id",
        wv."watchedAt",
        wv."watchedTimeInSecond" as "watchedTimeInSeconds",
        v."id" as "videoId",
        v."name" as "videoName",
        v."thumb" as "videoThumb",
        v."link" as "videoLink",
        c."id" as "categoryId",
        c."title" as "categoryTitle",
        c."icon" as "categoryIcon",
        p."id" as "professionalId",
        a."name" as "professionalName",
        a."surname" as "professionalSurname",
        a."photo" as "professionalPhoto",
        p."social" as "professionalSocial",
        p."cref" as "professionalCref"
      FROM "WatchedVideo" wv
        JOIN "Video" v ON v."id" = wv."videoId"
        JOIN "Category" c ON v."categoryId" = c."id"
        JOIN "Professional" p ON v."professionalId" = p."id"
        JOIN "Account" a ON p."accountId" = a."id"
      WHERE wv."accountId" = CAST(${accountId} AS UUID)
      ORDER BY wv."watchedAt" DESC
      LIMIT ${take} OFFSET ${skip};
    `;

    return lastWatched.map((entry) => this.toKeepWatchingResponseDto(entry));
  }

  async findOne(accountId: string, id: string) {
    const existsAccount = await this.existsAccountById(accountId);

    if (!existsAccount) {
      throw new NotFoundException(`Account with id=${accountId} does not exist.`);
    }

    const video = await this.prisma.watchedVideo.findUnique({
      where: {
        id
      },
      include: {
        video: {
          select: {
            name: true,
            thumb: true,
          }
        }
      }
    }).catch((error: PrismaClientKnownRequestError) => {
      this.logger.error(error)
      throw new InternalServerErrorException("Something went wrong while searching a watched video entry.")
    })

    if (!video) {
      throw new NotFound("Resource video history entry does not exist.")
    }

    const responseDto: FindWatchedVideoHistoryResponseDto = this.toWatchedVideoHistoryResponseDto(video);

    return responseDto;
  }

  private async existsAccountById(accountId: string) {
    const exists = await this.prisma.account.findUnique({
      where: {
        id: accountId
      }
    })

    return exists;
  }

  private toCreateWatchedVideoResponseDto(rawEntity: any): CreateWatchedVideoResponseDto {
    const responseDto: CreateWatchedVideoResponseDto = {
      id: rawEntity.id,
      watchedAt: rawEntity.watchedAt,
      watchedTimeInSeconds: rawEntity.watchedTimeInSecond, // do note that the DTO has an 's' at the end but the database entity does not
      accountId: rawEntity.accountId,
      videoId: rawEntity.videoId,
    }

    return responseDto;
  }

  private toWatchedVideoHistoryResponseDto(rawEntity: any): FindWatchedVideoHistoryResponseDto {
    const responseDto: FindWatchedVideoHistoryResponseDto = {
      id: rawEntity.id,
      watchedAt: rawEntity.watchedAt,
      watchedTimeInSeconds: rawEntity.watchedTimeInSecond, // do note that the DTO has an 's' at the end but the database entity does not
      video: {
        id: rawEntity.videoId,
        name: rawEntity.video.name,
        thumb: rawEntity.video.thumb?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
      }
    }

    return responseDto;
  }

  private toKeepWatchingResponseDto(rawEntity: FindKeepWatchingQuery): KeepWatchingLastVideosResponseDto {
    return {
      id: rawEntity.id,
      name: rawEntity.videoName,
      thumb: rawEntity.videoThumb?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
      link: rawEntity.videoLink?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
      watchedTimeInSeconds: rawEntity.watchedTimeInSeconds,
      videoId: rawEntity.videoId,
      category: {
        id: rawEntity.categoryId,
        title: rawEntity.categoryTitle,
        icon: rawEntity.categoryIcon?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
      },
      professional: {
        id: rawEntity.professionalId,
        fullName: rawEntity.professionalSurname ?
          `${rawEntity.professionalName} ${rawEntity.professionalSurname}` : rawEntity.professionalName,
        social: rawEntity.professionalSocial,
        cref: rawEntity.professionalCref,
        photo: rawEntity.professionalPhoto,
      }
    }
  }

  private mapHistoryResDtoReplaceThumbAndLink(response: VideoHistoryResponseDto): VideoHistoryResponseDto {
    return {
      ...response,
      day: response.day.map((day: HistoryDayEntryDto) => ({
        ...day,
        video: {
          ...day.video,
          thumb: day.video.thumb?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress) ?? '',
          link: day.video.link?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress) ?? '',
        },
      })),
    };
  }
}
