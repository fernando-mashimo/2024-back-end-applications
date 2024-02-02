import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateVideoSubgroupDto, UpdateVideoSubgroupDto } from './dto'
import { PrismaService } from '@src/database/prisma.service'
import { VideoSubgroup } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Injectable()
export class VideoSubgroupService {
  constructor(private readonly prismaService: PrismaService) {}

  create({ videoId, videoGroupId, order, name }: CreateVideoSubgroupDto) {
    return this.prismaService.videoSubgroup
      .create({
        data: {
          name,
          videoGroupId,
          order
        }
      })
      .catch((error: PrismaClientKnownRequestError) => {
        throw new BadRequestException(error, error.message)
      })
  }

  findAll(
    videoSubgroupDto: Partial<CreateVideoSubgroupDto>
  ): Promise<VideoSubgroup[]> {
    return this.prismaService.videoSubgroup.findMany({
      where: {
        videoGroupId: videoSubgroupDto.videoGroupId
      }
    })
  }

  findOne(id: string) {
    return this.prismaService.videoSubgroupVideo.findMany({
      where: {
        videoSubgroupId: id
      },
      include: {
        video: true,
        videoSubgroup: true
      }
    })
  }

  update(id: string, updateVideoSubgroupDto: UpdateVideoSubgroupDto) {
    return this.prismaService.videoSubgroup.update({
      where: {
        id
      },
      data: {
        videos: {
          connect: {
            id: updateVideoSubgroupDto.videoId
          }
        }
      }
    })
  }

  remove(id: string) {
    return this.prismaService.videoSubgroup.delete({
      where: {
        id
      }
    })
  }
}
