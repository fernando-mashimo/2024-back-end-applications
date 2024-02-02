import { IsDefined, IsOptional, IsString } from 'class-validator';

export class UpdateCourseOrderDto {
  @IsOptional()
  @IsString()
  courseURL?: string;

  @IsOptional()
  @IsString()
  otherInfo?: string;

  @IsDefined()
  @IsOptional()
  file: Express.Multer.File;
}
