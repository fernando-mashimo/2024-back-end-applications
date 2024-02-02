import { PartialType } from '@nestjs/mapped-types'
import { CreateVideoGroupDto } from './createVideoGroup.dto'

export class UpdateVideoGroupDto extends PartialType(CreateVideoGroupDto) {}
