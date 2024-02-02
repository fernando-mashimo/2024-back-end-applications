import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateWatchedVideoDto {
    @IsNumber()
    @IsNotEmpty()
    watchedTimeInSecond: number
}
