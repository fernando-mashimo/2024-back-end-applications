import { PartialType } from '@nestjs/mapped-types'
import { CreateVideoSubgroupDto } from './createVideoSubgroup.dto'

export class UpdateVideoSubgroupDto extends PartialType(
  CreateVideoSubgroupDto
) {}
