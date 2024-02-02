import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class CourseInfoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  creatorName: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsNumber()
  length: number;
}

export class CreateCourseOrderDto {
  @IsNotEmpty()
  @IsString()
  nutritionistId: string;

  @IsNotEmpty()
  @IsString()
  orderFormId: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsNotEmpty()
  @IsNumber()
  coursePriceBRL: number;

  @IsNotEmpty()
  @IsNumber()
  coursePricePoints: number;

  @IsOptional()
  @IsString()
  otherInfo?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CourseInfoDto)
  courseInfo: CourseInfoDto;
}
