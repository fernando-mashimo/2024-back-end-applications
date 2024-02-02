import { NotFoundException } from '@nestjs/common'

export class RejectedPayment extends NotFoundException {
  constructor(
    msg: string,
    public reason?: Record<string, unknown>
  ) {
    super(msg)
  }
}
