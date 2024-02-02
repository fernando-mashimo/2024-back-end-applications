import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested
} from 'class-validator'

class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string

  @IsString()
  @IsNotEmpty()
  number: string

  @IsString()
  @IsNotEmpty()
  zip_code: string

  @IsString()
  @IsNotEmpty()
  neighborhood: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  state: string

  @IsString()
  @IsNotEmpty()
  country: string

  @IsString()
  @IsOptional()
  complement: string
}

class CardDto {
  @IsString()
  @IsNotEmpty()
  number: string

  @IsString()
  @IsNotEmpty()
  holder_name: string

  @IsNumber()
  @IsNotEmpty()
  exp_month: number

  @IsNumber()
  @IsNotEmpty()
  exp_year: number

  @IsString()
  @IsNotEmpty()
  cvv: string

  @ValidateNested()
  billing_address: AddressDto
}

class PhoneDto {
  @IsString()
  @IsNotEmpty()
  area_code: string

  @IsString()
  @IsNotEmpty()
  number: string
}

export class Customer {
  @IsUUID()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsString()
  type: string

  @IsString()
  @IsNotEmpty()
  document: string

  @IsString()
  @IsNotEmpty()
  document_type: string

  @ValidateNested()
  phone: PhoneDto
}

export class CreatePaymentCreditCardDto {
  @IsUUID()
  @IsNotEmpty()
  planId: string

  @ValidateNested()
  card: CardDto
  @ValidateNested()
  customer: Customer
}

export class CreatePaymentPixDto {
  @IsUUID()
  @IsNotEmpty()
  planId: string

  @ValidateNested()
  customer: Customer
}
