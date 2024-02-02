import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { errorStatusCode } from '../helpers/errorHandler'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: Error, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      throw exception
    }

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = errorStatusCode(exception)
    let message = status !== 500 ? exception.message : 'Internal server error'

    this.logger.error({ exception })

    if (exception instanceof PrismaClientKnownRequestError) {
      message = exception?.meta?.cause as string
    }

    response.status(status).send({
      status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url
    })
  }
}
