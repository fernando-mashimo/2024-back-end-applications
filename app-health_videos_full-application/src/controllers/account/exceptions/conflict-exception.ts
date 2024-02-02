import {
  Catch,
  ExceptionFilter,
  ConflictException,
  ArgumentsHost
} from '@nestjs/common'
import { Response } from 'express'

@Catch(ConflictException)
export class ConflictExceptionFilter implements ExceptionFilter {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(409).json({
      status: 409,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url
    })
  }
}
