import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { PaymentService } from './payment.service'
import { CreatePaymentCreditCardDto, UpdatePaymentDto } from './dto'
import { ChargePaidDto } from './dto/ChargePaid.dto'
import { routes } from '@src/common/baseRoutes'

@Controller(routes.payment)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  // @Post('/creditcard')
  // creditcard(@Body() createPaymentDto: CreatePaymentCreditCardDto) {
  //   return this.paymentService.create(createPaymentDto)
  // }

  // @Post('/pix')
  // pix(@Body() createPaymentDto: CreatePaymentCreditCardDto) {
  //   return this.paymentService.pix(createPaymentDto)
  // }

  // @Post('/charge-paid')
  // chargePaid(@Body() chargePaid: ChargePaidDto) {
  //   this.paymentService.chargePaid(chargePaid.data)
  // }

  // @Get()
  // findAll() {
  //   return this.paymentService.findAll()
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.paymentService.findOne(id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
  //   return this.paymentService.update(id, updatePaymentDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.paymentService.remove(id)
  // }
}
