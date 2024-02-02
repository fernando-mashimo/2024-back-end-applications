import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { routes } from '@src/common/baseRoutes'
import { AuthService } from './auth.service'
// import { ChangePasswordDto } from './dto/change-passwotd.dto'
import pino from 'pino'
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger'
import { PublicEndpoint } from '@src/helpers/public-endpoint'
import { LoginDto } from './dto/login-request.dto'
import { RefreshDto } from './dto/refresh-request.dto'
import { RefreshToken } from '@prisma/client'

@Controller(routes.auth)
export class AuthController {
  private readonly logger = pino()
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    status: 201,
    description: 'Returns user authentication/authorization data'
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found'
  })
  @Post('login')
  @PublicEndpoint()
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() loginDto: LoginDto) {
    this.logger.info(
      `Login request. Initiating login process for user ${loginDto.email}`
    )
    return this.authService.login(loginDto)
  }

  @Post('refresh')
  @PublicEndpoint()
  @UsePipes(new ValidationPipe({ transform: true }))
  refreshToken(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshAuthentication(refreshDto)
  }

  @ApiOkResponse({
    status: 200,
    description: 'Returns user authorization data'
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found'
  })
  @Get('authorization/:id')
  getRefreshToken(@Param('id', new ParseUUIDPipe()) id: string) {
    this.logger.info(
      `Calling retrieve authorization method for accountId=${id}`
    )
    return this.authService.getRefreshToken(id)
  }

  // @Patch('change-password/:id')
  // changePassword(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() body: ChangePasswordDto
  // ) {
  //   this.authService.changePassword(id, body)
  // }

  @Patch('logout/:id')
  async logout(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<Partial<RefreshToken>> {
    this.logger.info(`Calling logout method for accountId=${id}`)
    return this.authService.logout(id)
  }
}
