import { NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import Pino from 'pino'

import { Forbidden } from 'src/errors'
const logger = Pino()

export interface Identity {
  userId: string
  providerName: string
  providerType: string
  issuer: null
  primary: string
  dateCreated: string
}

export interface Authorization {
  userId: string
}

const isForbidden = (token: string | undefined): boolean => {
  if (!token) return true
  // valida mac-address
}

export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { macaddress } = req.headers

    const macAddressHeader = Array.isArray(macaddress)
      ? macaddress[0]
      : macaddress

    if (isForbidden(macAddressHeader)) {
      logger.warn(
        `Forbidden: mac-address not valid ${JSON.stringify(req.headers)}`
      )
      next(
        new Forbidden('Forbidden', {
          macAddress: macaddress
        })
      )
    } else {
      next()
    }
  }
}
