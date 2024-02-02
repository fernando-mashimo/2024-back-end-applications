import { Transform, Type } from 'class-transformer';
import { IsDate, IsDateString, IsNotEmpty, IsNumber, MinDate } from 'class-validator';

export class UpdateVideoWatchedDto {

    
    @IsDate()
    @Transform(({ value }) => new Date(value * 1000))
    @Type(() => Date)
    @IsNotEmpty()
    watchedAt: Date


    @IsNumber()
    @IsNotEmpty()
    watchedTimeInSecond: number


    
    
}
