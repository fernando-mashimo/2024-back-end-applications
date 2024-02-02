import { BadRequestException, HttpStatus, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'

import { MissingData, NotFound, Forbidden, RejectedPayment } from '../errors'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { BadRequest } from '@src/errors/bad-request'

interface Response {
  statusCode: HttpStatus
  body: string
  headers: { [header: string]: string | number | boolean }
}

export const makeErrorBody = (error: Error, statusCode: number) => {
  if (statusCode === 500) {
    return JSON.stringify({
      message: 'Internal server error'
    })
  }

  return JSON.stringify({
    reason: error.name,
    message: error.message.normalize()
  })
}

export const errorStatusCode = (error: unknown): HttpStatus => {
  if (!(error instanceof Error)) {
    return HttpStatus.INTERNAL_SERVER_ERROR
  }
  switch (error.constructor) {
    case BadRequestException:
    case BadRequest:
    case MissingData:
    case RejectedPayment:
      return HttpStatus.BAD_REQUEST
    case NotFoundException:
    case NotFound:
    case PrismaClientKnownRequestError:
      return HttpStatus.NOT_FOUND
    case Forbidden:
      return HttpStatus.FORBIDDEN
    case UnauthorizedException:
      return HttpStatus.UNAUTHORIZED
    default:
      return HttpStatus.INTERNAL_SERVER_ERROR
  }
}

export const errorHandler = (
  error: unknown,
  logger: Logger,
  requestId: string
): Response => {
  const statusCode = errorStatusCode(error)

  logger.error({ error })

  if (!(error instanceof Error)) {
    return {
      statusCode,
      body: 'Unknown error',
      headers: {
        'Trace-Id': requestId
      }
    }
  }

  return {
    statusCode,
    body: makeErrorBody(error, statusCode),
    headers: {
      'Trace-Id': requestId
    }
  }
}
