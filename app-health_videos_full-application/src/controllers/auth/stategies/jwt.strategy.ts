import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import pino from 'pino'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = pino()
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY
    })
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email }
  }
}
