import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoCategoryDto } from './create-video-category.dto';
import { IsUUID } from 'class-validator';

export class UpdateVideoCategoryDto extends PartialType(CreateVideoCategoryDto) {
}
