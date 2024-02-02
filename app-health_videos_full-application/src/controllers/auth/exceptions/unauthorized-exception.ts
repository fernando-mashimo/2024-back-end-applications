import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  UnauthorizedException
} from '@nestjs/common'
import { Response } from 'express'

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(401).json({
      status: 401,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url
    })
  }
}
