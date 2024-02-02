import { PartialType } from '@nestjs/swagger';
import { CreateNewsRequestDto } from './create-news-request.dto';

export class UpdateNewsDto extends PartialType(CreateNewsRequestDto) {}
