import { Injectable } from '@nestjs/common'
import {
  CreatePlaylistDto,
  FindAllPlaylistDto,
} from './dto/'
import { PrismaService } from '@src/database/prisma.service'
import { Prisma } from '@prisma/client'
import { makePagination } from '@src/helpers/makePagination'
import { NotFound } from '@src/errors'
import { FindPlaylistVideosResponseDto, PlaylistGroupDto, PlaylistSubgroupDto, VideoDto } from './dto/find-playlist-videos-response.dto'
import { plainToClass } from 'class-transformer'
import { FindPlaylistVideosQuery } from './entities/find-playlist-videos.entity'
import { Playlist } from './entities/playlist.entity'
import { ConfigService } from '@nestjs/config'
import { Authentication } from '../auth/jwt-entities/authentication'
import { AccessJwtSubscriptionType } from '../auth/jwt-entities/access-jwt-payload.entity'

@Injectable()
export class PlaylistService {
  private readonly cdnAddress: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.cdnAddress = this.configService.get<string>('CDN_ADDRESS');
  }

  create(createPlaylistDto: CreatePlaylistDto) {
    const input: Prisma.PlaylistCreateInput = {
      name: createPlaylistDto.name,
      description: createPlaylistDto.description,
      thumb: createPlaylistDto.thumb,
      public: false,
      video: {
        connect: {
          id: createPlaylistDto.videoId
        }
      },
      category: {
        connect: {
          id: createPlaylistDto.categoryId
        }
      }
    }

    return this.prismaService.playlist.create({
      data: input
    })
  }

  findAll({ categoryId, pageNumber, itemPerPage }: FindAllPlaylistDto) {
    const { skip, take } = makePagination(pageNumber, itemPerPage)

    return this.prismaService.playlist.findMany({
      where: {
        categoryId
      },
      skip,
      take
    })
  }

  async findPlaylistVideos(
    playlistId: string,
    authentication: Authentication,
  ): Promise<FindPlaylistVideosResponseDto> {
    const existsPlaylist: Playlist = await this.prismaService.playlist.findUnique({
      where: {
        id: playlistId,
      }
    })

    if (!existsPlaylist) {
      throw new NotFound(`Playlist of id=${playlistId} does not exist.`)
    }

    const playlist: FindPlaylistVideosQuery[] = await this.prismaService.$queryRaw`
      SELECT
        vsv."id" AS vsv_id,
        vsv."order" AS vsv_order,
        v.id AS video_id,
        v."name" AS video_name,
        v.link AS video_link,
        v.thumb AS video_thumb,
        v."videoType" AS video_videoType,
        v."categoryId" AS video_categoryId,
        vsg."order" AS vsg_order,
        vg.id AS videoGroup_id,
        vg."name" AS videoGroup_name,
        vg."order" AS videoGroup_order,
        vg."classFrequency" AS videoGroup_classFrequency,
        vg."playlistId" AS videoGroup_playlistId,
        vs.id AS videoSubgroup_id,
        vs."name" AS videoSubgroup_name,
        vs."order" AS videoSubgroup_order,
        vs."videoGroupId" AS videoSubgroup_videoGroupId
      FROM "VideoSubgroupVideo" vsv
        JOIN "Video" v ON vsv."videoId" = v.id
        JOIN "VideoSubgroup" vs ON vsv."videoSubgroupId" = vs.id
        LEFT JOIN "VideoGroup" vg ON vs."videoGroupId" = vg.id
        LEFT JOIN "VideoSubgroup" vsg ON vsg.id = vs."videoGroupId"
      WHERE vg."playlistId" = CAST(${playlistId} AS UUID)
      ORDER BY vs."order", vsv."order", vsg."order";
    `;

    // const mockPlaylist = this.getMockPlaylistVideosQuery(); // This is a mock with a specific case of playlist. Two weeks, two contents in a day

    const isSubscriber = authentication.principal.subscriptionType == AccessJwtSubscriptionType.SUBSCRIBER;
    const formattedPlaylist: PlaylistGroupDto[] = this.toPlaylistGroupDto(playlist, isSubscriber);

    const responseDto: FindPlaylistVideosResponseDto = this.toFindPlaylistVideosResponseDto(existsPlaylist, formattedPlaylist);

    return responseDto;
  }

  findOne(id: string) {
    const playlist = this.prismaService.playlist.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        thumb: true,
        categoryId: true,
      }
    })

    return playlist;
  }

  // update(id: string, updatePlaylistDto: UpdatePlaylistDto) {
  //   return this.prismaService.playlist.update({
  //     where: {
  //       id
  //     },
  //     data: {
  //       category: updatePlaylistDto.categoryId,
  //       categoryId: updatePlaylistDto.categoryId,
  //       description, updatePlaylistDto.description,

  //      }
  //   })
  // }

  remove(id: string) {
    return this.prismaService.playlist.delete({
      where: { id }
    })
  }

  private toPlaylistGroupDto(
    rawFindVideoPlaylistVideos: FindPlaylistVideosQuery[],
    isSubscriber: boolean,
  ): PlaylistGroupDto[] {
    const groupMap = new Map<string, PlaylistGroupDto>();
    const subgroupMap = new Map<string, PlaylistSubgroupDto>();

    rawFindVideoPlaylistVideos.forEach((rawFindVideoPlaylistVideoEntry, index) => {
      const groupId = rawFindVideoPlaylistVideoEntry.videogroup_id;
      const subgroupId = rawFindVideoPlaylistVideoEntry.videosubgroup_id;

      if (!groupMap.has(groupId)) {
        const groupDto = plainToClass(PlaylistGroupDto, {
          id: rawFindVideoPlaylistVideoEntry.videogroup_id,
          order: rawFindVideoPlaylistVideoEntry.videogroup_order,
          name: rawFindVideoPlaylistVideoEntry.videogroup_name,
          subgroups: [],
        });
        groupMap.set(groupId, groupDto);
      }

      if (!subgroupMap.has(subgroupId)) {
        const subgroupDto = plainToClass(PlaylistSubgroupDto, {
          id: rawFindVideoPlaylistVideoEntry.videosubgroup_id,
          order: rawFindVideoPlaylistVideoEntry.videosubgroup_order,
          name: rawFindVideoPlaylistVideoEntry.videosubgroup_name,
          videos: [],
        });
        subgroupMap.set(subgroupId, subgroupDto);
        groupMap.get(groupId)?.subgroups.push(subgroupDto);
      }

      const videoDto = plainToClass(VideoDto, {
        id: rawFindVideoPlaylistVideoEntry.video_id,
        order: rawFindVideoPlaylistVideoEntry.vsv_order,
        name: rawFindVideoPlaylistVideoEntry.video_name,
        thumb: rawFindVideoPlaylistVideoEntry.video_thumb?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress) || '',
        link: (isSubscriber || (index === 0 && !subgroupMap.get(subgroupId)?.videos.length))
          ? rawFindVideoPlaylistVideoEntry.video_link?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress) || ''
          : '',
        /**
         * ternary explanation:
         * isSubscriber=true .: always assigns the video link;
         * isSubscriber=false .: passes to the second part of condition
         * — index=0 first video
         * — !...videos.length return true when no videos, and false when there is a video on the array
         * 
         * so, this ternary displays only the first video of a playlist if the account isnt a subscriber
         */
      });

      subgroupMap.get(subgroupId)?.videos.push(videoDto);
    })

    return Array.from(groupMap.values());
  }

  private toFindPlaylistVideosResponseDto(playlist: Playlist, playlistGroup: PlaylistGroupDto[]): FindPlaylistVideosResponseDto {
    const responseDto: FindPlaylistVideosResponseDto = {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      thumb: playlist.thumb?.replace('https://videos-move.s3.amazonaws.com/', this.cdnAddress),
      content: playlistGroup,
    }

    return responseDto;
  }

  getMockPlaylistVideosQuery(): FindPlaylistVideosQuery[] {
    return [
      {
        "vsv_id": "96c0631c-faec-4402-b048-da3c51cb128e",
        "vsv_order": 1,
        "video_id": "62f3e044-037f-455e-b1c6-7a8c8aa97326",
        "video_name": "Core 1",
        "video_link": "https://movehealth.app/aulas/577594386.mp4",
        "video_thumb": null,
        "video_videotype": "VIDEO",
        "video_categoryid": "7bda230f-4b13-4f48-bf43-ac4210d55dfe",
        "vsg_order": null,
        "videogroup_id": "87bef082-8df8-4244-b274-5fab7173445d",
        "videogroup_name": "Semana 1",
        "videogroup_order": 1,
        "videogroup_classfrequency": "DAILY",
        "videogroup_playlistid": "5767e702-8a36-4dc2-a2f3-5aa26827ae89",
        "videosubgroup_id": "465ba2b2-76cd-4bfb-95ef-6517c5eff98b",
        "videosubgroup_name": "Dia 1",
        "videosubgroup_order": 1,
        "videosubgroup_videogroupid": "87bef082-8df8-4244-b274-5fab7173445d"
      },
      {
        "vsv_id": "e8e76dec-1e8a-4161-9b69-1096cb40bbbd",
        "vsv_order": 1,
        "video_id": "e1178f5b-d3dd-43c9-a598-4f48bc8cd7aa",
        "video_name": "Core 2",
        "video_link": "https://movehealth.app/aulas/579455318.mp4",
        "video_thumb": null,
        "video_videotype": "VIDEO",
        "video_categoryid": "7bda230f-4b13-4f48-bf43-ac4210d55dfe",
        "vsg_order": null,
        "videogroup_id": "87bef082-8df8-4244-b274-5fab7173445d",
        "videogroup_name": "Semana 1",
        "videogroup_order": 1,
        "videogroup_classfrequency": "DAILY",
        "videogroup_playlistid": "5767e702-8a36-4dc2-a2f3-5aa26827ae89",
        "videosubgroup_id": "4f361cce-58d1-4204-ad89-3b8e256b8a22",
        "videosubgroup_name": "Dia 2",
        "videosubgroup_order": 2,
        "videosubgroup_videogroupid": "87bef082-8df8-4244-b274-5fab7173445d"
      },
      {
        "vsv_id": "a94a7143-7777-48ef-adbf-c415d772d6d3",
        "vsv_order": 1,
        "video_id": "2627a2f6-149b-4ef8-86b5-25672a0d9c5e",
        "video_name": "Core 3",
        "video_link": "https://movehealth.app/aulas/591606798.mp4",
        "video_thumb": null,
        "video_videotype": "VIDEO",
        "video_categoryid": "7bda230f-4b13-4f48-bf43-ac4210d55dfe",
        "vsg_order": null,
        "videogroup_id": "87bef082-8df8-4244-b274-5fab7173445d",
        "videogroup_name": "Semana 1",
        "videogroup_order": 1,
        "videogroup_classfrequency": "DAILY",
        "videogroup_playlistid": "5767e702-8a36-4dc2-a2f3-5aa26827ae89",
        "videosubgroup_id": "f98d84d1-c593-49e7-b5df-9d7ae98e2071",
        "videosubgroup_name": "Dia 3",
        "videosubgroup_order": 3,
        "videosubgroup_videogroupid": "87bef082-8df8-4244-b274-5fab7173445d"
      },
      {
        "vsv_id": "df2d6798-88af-43f4-9880-125aa955ba67",
        "vsv_order": 1,
        "video_id": "7db614e1-c2dc-4d6f-887f-f856f9ec0607",
        "video_name": "Core 4",
        "video_link": "https://movehealth.app/aulas/611885114.mp4",
        "video_thumb": null,
        "video_videotype": "VIDEO",
        "video_categoryid": "7bda230f-4b13-4f48-bf43-ac4210d55dfe",
        "vsg_order": null,
        "videogroup_id": "87bef082-8df8-4244-b274-5fab7173445d",
        "videogroup_name": "Semana 1",
        "videogroup_order": 1,
        "videogroup_classfrequency": "DAILY",
        "videogroup_playlistid": "5767e702-8a36-4dc2-a2f3-5aa26827ae89",
        "videosubgroup_id": "e6620705-aceb-469b-a5a0-5fce5862aa79",
        "videosubgroup_name": "Dia 4",
        "videosubgroup_order": 4,
        "videosubgroup_videogroupid": "87bef082-8df8-4244-b274-5fab7173445d"
      },
      {
        "vsv_id": "a6f09ba8-ba0f-447e-aaf6-2cf4b8322683",
        "vsv_order": 1,
        "video_id": "62f3e044-037f-455e-b1c6-7a8c8aa97326",
        "video_name": "Core 1",
        "video_link": "https://movehealth.app/aulas/577594386.mp4",
        "video_thumb": null,
        "video_videotype": "VIDEO",
        "video_categoryid": "7bda230f-4b13-4f48-bf43-ac4210d55dfe",
        "vsg_order": null,
        "videogroup_id": "9302dcb1-7260-4d29-90db-115500dfd580",
        "videogroup_name": "Semana 2",
        "videogroup_order": 2,
        "videogroup_classfrequency": "DAILY",
        "videogroup_playlistid": "5767e702-8a36-4dc2-a2f3-5aa26827ae89",
        "videosubgroup_id": "6c5f30e8-56ab-4f9f-9bb5-84275e97a2b5",
        "videosubgroup_name": "Dia 1",
        "videosubgroup_order": 1,
        "videosubgroup_videogroupid": "9302dcb1-7260-4d29-90db-115500dfd580"
      },
      {
        "vsv_id": "34c20508-aa9d-4c01-9811-fc92ba03c205",
        "vsv_order": 1,
        "video_id": "e1178f5b-d3dd-43c9-a598-4f48bc8cd7aa",
        "video_name": "Core 2",
        "video_link": "https://movehealth.app/aulas/579455318.mp4",
        "video_thumb": null,
        "video_videotype": "VIDEO",
        "video_categoryid": "7bda230f-4b13-4f48-bf43-ac4210d55dfe",
        "vsg_order": null,
        "videogroup_id": "9302dcb1-7260-4d29-90db-115500dfd580",
        "videogroup_name": "Semana 2",
        "videogroup_order": 2,
        "videogroup_classfrequency": "DAILY",
        "videogroup_playlistid": "5767e702-8a36-4dc2-a2f3-5aa26827ae89",
        "videosubgroup_id": "69a2d16e-0d40-408c-a021-684a25c66343",
        "videosubgroup_name": "Dia 2",
        "videosubgroup_order": 2,
        "videosubgroup_videogroupid": "9302dcb1-7260-4d29-90db-115500dfd580"
      },
      {
        "vsv_id": "5a64b11e-4a44-4df8-af9a-4ff4e7c00339",
        "vsv_order": 2,
        "video_id": "e1178f5b-d3dd-43c9-a598-4f48bc8cd7aa",
        "video_name": "Core 3",
        "video_link": "https://movehealth.app/aulas/579455318.mp4",
        "video_thumb": null,
        "video_videotype": "VIDEO",
        "video_categoryid": "7bda230f-4b13-4f48-bf43-ac4210d55dfe",
        "vsg_order": null,
        "videogroup_id": "9302dcb1-7260-4d29-90db-115500dfd580",
        "videogroup_name": "Semana 2",
        "videogroup_order": 2,
        "videogroup_classfrequency": "DAILY",
        "videogroup_playlistid": "5767e702-8a36-4dc2-a2f3-5aa26827ae89",
        "videosubgroup_id": "69a2d16e-0d40-408c-a021-684a25c66343",
        "videosubgroup_name": "Dia 2",
        "videosubgroup_order": 2,
        "videosubgroup_videogroupid": "9302dcb1-7260-4d29-90db-115500dfd580"
      },
      {
        "vsv_id": "82efc393-b177-41cd-87f5-fc79b423c4d9",
        "vsv_order": 1,
        "video_id": "2627a2f6-149b-4ef8-86b5-25672a0d9c5e",
        "video_name": "Core 4",
        "video_link": "https://movehealth.app/aulas/591606798.mp4",
        "video_thumb": null,
        "video_videotype": "VIDEO",
        "video_categoryid": "7bda230f-4b13-4f48-bf43-ac4210d55dfe",
        "vsg_order": null,
        "videogroup_id": "9302dcb1-7260-4d29-90db-115500dfd580",
        "videogroup_name": "Semana 2",
        "videogroup_order": 2,
        "videogroup_classfrequency": "DAILY",
        "videogroup_playlistid": "5767e702-8a36-4dc2-a2f3-5aa26827ae89",
        "videosubgroup_id": "6ae30d3d-cd09-4848-91af-4ec9928beb09",
        "videosubgroup_name": "Dia 3",
        "videosubgroup_order": 3,
        "videosubgroup_videogroupid": "9302dcb1-7260-4d29-90db-115500dfd580"
      },
      {
        "vsv_id": "06106326-269f-4a6b-9470-1a5981bd5813",
        "vsv_order": 1,
        "video_id": "7db614e1-c2dc-4d6f-887f-f856f9ec0607",
        "video_name": "Core 5",
        "video_link": "https://movehealth.app/aulas/611885114.mp4",
        "video_thumb": null,
        "video_videotype": "VIDEO",
        "video_categoryid": "7bda230f-4b13-4f48-bf43-ac4210d55dfe",
        "vsg_order": null,
        "videogroup_id": "9302dcb1-7260-4d29-90db-115500dfd580",
        "videogroup_name": "Semana 2",
        "videogroup_order": 2,
        "videogroup_classfrequency": "DAILY",
        "videogroup_playlistid": "5767e702-8a36-4dc2-a2f3-5aa26827ae89",
        "videosubgroup_id": "88ab6c12-6fa4-4bb9-8d3e-9dbeb89b596d",
        "videosubgroup_name": "Dia 4",
        "videosubgroup_order": 4,
        "videosubgroup_videogroupid": "9302dcb1-7260-4d29-90db-115500dfd580"
      }
    ]
  }
}
