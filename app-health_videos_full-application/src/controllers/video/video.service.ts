import { Injectable } from '@nestjs/common'
import { CreateVideoListDto } from './dto/createVideo.dto'
import { UpdateVideoDto } from './dto/updateVideo.dto'
import { PrismaService } from '@src/database/prisma.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NotFound } from 'src/errors'
import { FindVideoDto } from './dto/findVideo.dto'
import { makePagination } from 'src/helpers/makePagination'

@Injectable()
export class VideoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ videos }: CreateVideoListDto) {
    return this.prismaService.video.createMany({
      data: videos,
      skipDuplicates: true
    })
  }

  async findAll({ itemPerPage, pageNumber, type }: FindVideoDto) {
    const { skip, take } = makePagination(pageNumber, itemPerPage)
    return this.prismaService.video.findMany({
      where: {
        videoType: type ?? 'VIDEO'
      },
      skip,
      take
    })
  }

  findOne(id: string) {
    return this.prismaService.video
      .findFirst({ where: { id } })
      .then((result) => {
        if (!result) throw new NotFound('Record not found')

        return result
      })
  }

  async update(
    id: string,
    { professionalId, categoryId, link, name, videoType }: UpdateVideoDto
  ) {
    return this.prismaService.video
      .update({
        where: { id },
        data: { professionalId, categoryId, link, name, videoType }
      })
      .catch((error: PrismaClientKnownRequestError) => {
        const notFountMessage = 'Record to update not found.'

        const { cause } = error.meta

        if (notFountMessage === cause) {
          throw new NotFound(cause)
        }

        throw error
      })
  }

  async remove(id: string) {
    return this.prismaService.video
      .delete({ where: { id } })
      .catch((error: PrismaClientKnownRequestError) => {
        const notFountMessage = 'Record to delete does not exist.'

        const { cause } = error.meta

        if (notFountMessage === cause) {
          throw new NotFound(cause)
        }

        throw error
      })
  }
}
