import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class ContentDto {
  @IsOptional()
  @Length(6, 6)
  @ApiProperty({
    description: 'The 6-digit code to be sent to the recipient',
    example: '123456',
  })
  accessCode: string;

  @IsOptional()
  @Length(2, 50)
  @ApiProperty({
    description: 'The full name of the recipient',
    example: 'John Doe',
  })
  fullName: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The amount to be paid',
    example: 50.25,
  })
  amountToPay: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The payment URL',
    example: 'https://example.com/payment',
  })
  paymentURL: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The token to be sent to the recipient',
    example: 123456,
  })
  token: number;
  // Incluir outros atributos a serem validados, conforme necessidade
}

export enum OriginType {
  CLUBE_NUTRI = 'clubeNutri',
  MOVE_REMINDER = 'RENOVATION_PLAN',
  MOVE_ALERT1 = 'FAILED_PAYMENT',
  MOVE_ALERT2 = 'LAST_DAY_BEFORE_CANCELLATION',
  MOVE_CANCEL = 'CANCELLATION',
  MOVE_FORGOT_PASSWORD = 'MOVE_FORGOT_PASSWORD',
  // Incluir outros tipos de origem, conforme necessidade
}

export class EmailDataDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The recipient email address',
    example: 'example@email.com',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  email: string;

  @IsNotEmpty()
  @IsEnum(OriginType)
  @ApiProperty({
    enum: OriginType,
    description:
      'The origin application. Currently possible values: clubeNutri, RENOVATION_PLAN, FAILED_PAYMENT, LAST_DAY_BEFORE_CANCELLATION, CANCELLATION, MOVE_FORGOT_PASSWORD',
    example: 'clubeNutri',
  })
  origin: OriginType;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ContentDto)
  @ApiProperty({
    description: 'The content of the email',
    type: ContentDto,
  })
  content: ContentDto;
}
