import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class CreateProfessionalDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    surname: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(11, 11)
    cpf: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(36)
    cref: string;
}
