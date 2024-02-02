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
import { AccountService } from './account.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import pino from 'pino'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger'
import { VerifyCpfDto } from './dto/verify-cpf.dto'
import { PublicEndpoint } from '@src/helpers/public-endpoint'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { Throttle } from '@nestjs/throttler'
import { VerifyTokenDto } from './dto/verify-token.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Controller(routes.account)
@ApiTags('Account')
export class AccountController {
  private readonly logger = pino()

  constructor(private readonly accountService: AccountService) {}

  // TODO: Remover método, pois é utilizado somente para testes
  @Get()
  findAll() {
    this.logger.info('Calling account list method')
    return this.accountService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    this.logger.info(`Calling account detail method for accountId ${id}`)
    const res = await this.accountService.findOne(id)
    return res
  }

  // @Get('device/:macAddress')
  // async findAccountByDevice(@Param('macAddress') macAddress: string) {
  //   const res = await this.accountService.findAccountByDevice(macAddress)
  //   this.logger.info('response', res)
  //   return res
  // }

  @Get('verifyCpf/:cpf')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  )
  @ApiBadRequestResponse({
    status: 400,
    description: 'Cpf is not valid'
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Cpf is already registered'
  })
  @ApiOkResponse({
    status: 200,
    description: 'Cpf is valid'
  })
  async verifyCPf(@Param() param: VerifyCpfDto) {
    this.logger.info('Calling CPF verification method')
    const { cpf } = param
    const response = await this.accountService.verifyCPF(cpf)
    this.logger.info('Exiting CPF verification method (CPF is valid)')
    return response
  }

  @Throttle({ default: { limit: 5, ttl: 1000 } })
  @Post()
  @PublicEndpoint()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  )
  async register(@Body() createAccountDto: CreateAccountDto) {
    this.logger.info('Calling account creation method')
    const response = await this.accountService.register(createAccountDto)
    this.logger.info('Exiting account creation method (success)')
    return response
  }

  @Patch(':id')
  async updateAccount(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAccountDto: UpdateAccountDto
  ) {
    this.logger.info(`Calling update method for accountId ${id}`)
    const response = await this.accountService.update(id, updateAccountDto)
    return response
  }

  @Throttle({ default: { limit: 2, ttl: 1000 } })
  @Post('forgot-password/send-token')
  @PublicEndpoint()
  @ApiNotFoundResponse({
    status: 404,
    description: 'Email not found'
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Email containing token sent to user'
  })
  async sendToken(@Body() forgotPasswordDto: ForgotPasswordDto) {
    this.logger.info(
      `Calling forgotPassword method for email ${forgotPasswordDto.email}`
    )
    const response = await this.accountService.sendToken(forgotPasswordDto)
    this.logger.info('Exiting forgotPassword method (success)')
    return response.data
  }

  @Throttle({ default: { limit: 2, ttl: 1000 } })
  @Post('forgot-password/verify-token')
  @PublicEndpoint()
  @ApiNotFoundResponse({
    status: 404,
    description: 'Either token or account with provided email not found'
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Either token has expired or is not valid'
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Token is valid and has been set as used in database'
  })
  async verifyToken(@Body() verifyTokenDto: VerifyTokenDto): Promise<object> {
    this.logger.info(
      `Calling token verification method for account with email ${verifyTokenDto.email}`
    )
    const response = await this.accountService.verifyToken(verifyTokenDto)
    this.logger.info('Exiting token verification method (success)')
    return response
  }

  @Patch('forgot-password/reset-password')
  @PublicEndpoint()
  @ApiNotFoundResponse({
    status: 404,
    description: 'Account not found'
  })
  @ApiOkResponse({
    status: 200,
    description: 'Password has been successfully reset by user'
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<object> {
    this.logger.info(
      `Calling resetPassword method for account with id ${resetPasswordDto.accountId}`
    )
    const response = await this.accountService.resetPassword(resetPasswordDto)
    this.logger.info('Exiting resetPassword method (success)')
    return response
  }
}
