import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentCreditCardDto } from './createPayment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentCreditCardDto) {}
