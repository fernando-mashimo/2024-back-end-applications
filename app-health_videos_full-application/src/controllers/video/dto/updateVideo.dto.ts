import { PartialType } from '@nestjs/mapped-types'
import { CreateVideoDto } from './createVideo.dto'

export class UpdateVideoDto extends PartialType(CreateVideoDto) {}
