import { BadRequestException } from "@nestjs/common";

export class BadRequest extends BadRequestException {
    constructor(
      msg: string,
      public reason?: Record<string, unknown>
    ) {
      super(msg)
    }
  }
  