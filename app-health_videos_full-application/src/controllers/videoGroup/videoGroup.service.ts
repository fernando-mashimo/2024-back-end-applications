import { Injectable } from '@nestjs/common'
import { CreateVideoGroupDto } from './dto/createVideoGroup.dto'
import { UpdateVideoGroupDto } from './dto/updateVideoGroup.dto'
import { PrismaService } from '@src/database/prisma.service'
import { FindVideoGroupDto } from './dto/findVideoGroup.dto'
import { makePagination } from '@src/helpers/makePagination'
import { Prisma } from '@prisma/client'
@Injectable()
export class VideoGroupService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({
    name,
    playlistId,
    videos,
    order,
    classFrequency
  }: CreateVideoGroupDto) {
    let input: Prisma.VideoGroupCreateInput = {
      name: name,
      playlist: {
        connect: {
          id: playlistId
        }
      },
      order,
      classFrequency
    }

    if (videos) {
      const videoList = videos.map(({ videoId: id }) => ({ id }))
      input = {
        ...input
      }
    }

    return this.prismaService.videoGroup.create({
      data: input
    })
  }

  findAll({ itemPerPage, pageNumber }: FindVideoGroupDto) {
    const { skip, take } = makePagination(pageNumber, itemPerPage)
    return this.prismaService.videoGroup.findMany({
      skip,
      take
    })
  }

  findOne(id: string) {
    return this.prismaService.videoGroup.findFirstOrThrow({
      where: { id },
      include: {        
        videoSubgroups: true,        
      }
    })
  }

  update(id: string, updateVideoGroupDto: UpdateVideoGroupDto) {
    return this.prismaService.videoGroup.update({
      where: { id },
      data: {
        name: updateVideoGroupDto.name
      }
    })
  }

  remove(id: string) {
    return this.prismaService.videoGroup.delete({
      where: { id }
    })
  }
}
