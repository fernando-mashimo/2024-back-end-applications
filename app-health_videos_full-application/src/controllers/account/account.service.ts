import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import {
  constraintErrorCodes,
  notFoundCodes
} from '@src/helpers/error-code.helper'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '@src/database/prisma.service'
import { BadRequest } from 'src/errors/bad-request'
// import { GetAccountResponseDto } from './dto/get-account-response.dto' // TODO: fix usage of this with a mapper
import { UpdateAccountDto } from './dto/update-account.dto'
import { Account, AccountType } from './entities/account.entity'
import { CreateAccountDto } from './dto/create-account.dto'
import pino from 'pino'
import S3Service from '@src/common/external-services/s3-file-handling.service'
import { AccountDetailsService } from '../account-details/account-details.service'
import { AccountCategoryInterestsService } from '../account-category-interests/account-category-interests.service'
import { SubscriptionService } from '../subscription/subscription.service'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { PasswordResetTokensService } from '../password-reset-tokens/password-reset-tokens.service'
import { MailerService } from '@src/common/external-services/mailer.service'
import { VerifyTokenDto } from './dto/verify-token.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Injectable()
export class AccountService {
  private readonly logger = pino()
  private readonly s3Service = new S3Service()
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountDetailsService: AccountDetailsService,
    private readonly accountCategoryInterestsService: AccountCategoryInterestsService,
    private readonly subscriptionService: SubscriptionService,
    private readonly passwordResetTokensService: PasswordResetTokensService,
    private readonly mailerService: MailerService
  ) {}

  async findAll() {
    const accounts /*: GetAccountResponseDto[]*/ =
      await this.prisma.account.findMany({
        include: {
          ResponsibilityTerm: {
            select: {
              id: true,
              accepted: true,
              responseDate: true
            }
          },
          accountDetails: {
            select: {
              id: true,
              medicalRestrictions: true,
              objectives: true,
              interests: {
                select: {
                  categoryId: true
                }
              }
            }
          }
        }
      })
    for (const acc of accounts) {
      this.removePasswordFromResponse(acc)
    }
    return accounts
  }

  async findOne(id: string) {
    try {
      this.logger.debug(id)
      const account = await this.prisma.account.findUnique({
        where: { id },
        include: {
          ResponsibilityTerm: {
            select: {
              id: true,
              accepted: true,
              responseDate: true
            }
          },
          accountDetails: {
            select: {
              id: true,
              medicalRestrictions: true,
              objectives: true,
              interests: {
                select: {
                  categoryId: true
                }
              }
            }
          },
          subscription: {
            select: {
              status: true,
              billingFrequency: true,
              startAt: true,
              expDate: true
            }
          }
        }
      })
      if (!account) {
        this.logger.error(`Account with id ${id} not found`)
        throw new NotFoundException('Account not found')
      }
      delete account.password
      this.logger.info(`Account with id ${id} found - returning data`)
      return {
        ...account
      }
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(error.message)
      } else if (constraintErrorCodes.includes(error.code)) {
        throw new BadRequest('Erro de constraint')
      }
      throw new InternalServerErrorException(
        'Something went wrong while trying to find account'
      )
    }
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    // valida se a conta com o id informado existe e se o email informado não está sendo utilizado por outra conta - se sim, joga um erro
    await this.updateAccountValidations(id, updateAccountDto)

    const updatedAccount = await this.updateAccount(updateAccountDto, id)

    this.logger.info('update>updatedAccount ', updatedAccount)
    return this.removePasswordFromResponse(updatedAccount)
  }

  async register(account: CreateAccountDto) {
    try {
      this.logger.info('Encrypting sensitive data')
      const password = bcrypt.hashSync(account.password, 10)
      this.logger.info('Data encrypted successfully')
      this.logger.info('Re-checking CPF')
      await this.verifyCPF(account.cpf)
      this.logger.info('CPF re-checked successfully')
      this.logger.info('Initiating account creation')
      let createdAccount = await this.prisma.account.create({
        data: {
          name: account.name,
          surname: account.surname,
          email: account.email,
          password,
          cpf: account.cpf,
          height: account.height,
          weight: account.weight,
          birthday: account.birthday,
          ResponsibilityTerm: {
            create: {
              accepted: account.accepted
            }
          },
          accountType: AccountType.CUSTOMER
        },
        include: {
          ResponsibilityTerm: true,
          subscription: true
        }
      })
      createdAccount = this.removePasswordFromResponse(createdAccount)
      this.logger.info('Account created successfully')
      this.logger.info(
        'Appending subscription plan of type "Free" to account...'
      )
      const { startAt, expDate, status, billingFrequency } =
        await this.subscriptionService.createOrUpdate(createdAccount.cpf, {
          plan_mode: 'free',
          status: 'active',
          apiKey: '700ef1be-cd96-4361-afdb-a840dc28cef0'
        })
      this.logger.info('Subscription plan appended successfully')
      return {
        ...createdAccount,
        subscription: {
          startAt,
          expDate,
          status,
          billingFrequency
        }
      }
    } catch (error) {
      if (error.code === 'P2002') {
        this.logger.error('Account already exists')
        throw new ConflictException(
          'Account already exists - review account data'
        )
      }
      if (error.response.statusCode === 400) {
        this.logger.error(error.response.message)
        throw new BadRequestException(error.response)
      }
      if (error.response.statusCode === 409) {
        this.logger.error(error.response.message)
        throw new ConflictException(error.response)
      }
      this.logger.error(error.message)
      throw new Error(error)
    }
  }

  async verifyCPF(cpf: string) {
    try {
      this.logger.info('Checking if CPF is valid')
      const cpfIsValid = this.verifyCPFLogic(cpf)
      if (!cpfIsValid) {
        throw new BadRequestException('CPF is not valid')
      }
      this.logger.info('CPF is valid')
      this.logger.info('Checking if CPF is already registered')
      const isCPFAlreadyRegistered = await this.prisma.account.findUnique({
        where: {
          cpf
        }
      })
      if (isCPFAlreadyRegistered) {
        throw new ConflictException('CPF already registered')
      }
      this.logger.info('CPF is not registered - Good to go')
      return true
    } catch (error) {
      const { statusCode } = error.response
      if (statusCode === 400 || statusCode === 409) {
        this.logger.error(error.response.message)
        throw new BadRequestException(error.response)
      }
      this.logger.error(error.message)
      throw new Error(error)
    }
  }

  verifyCPFLogic(cpf: string): boolean {
    let soma = 0
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf[i]) * (10 - i)
    }
    let digito1 = 11 - (soma % 11)
    digito1 = digito1 > 9 ? 0 : digito1

    // Calcular o segundo dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf[i]) * (11 - i)
    }
    let digito2 = 11 - (soma % 11)
    digito2 = digito2 > 9 ? 0 : digito2

    // Verificar se os dígitos verificadores calculados são iguais aos fornecidos
    return parseInt(cpf[9]) === digito1 && parseInt(cpf[10]) === digito2
  }

  async getAccountByEmail(email: string) {
    return await this.prisma.account.findUnique({
      where: {
        email: email
      }
    })
  }

  async checkEmailBelongsToOtherAccount(
    email: string,
    id: string
  ): Promise<boolean> {
    const account = await this.getAccountByEmail(email)
    this.logger.info('checkEmailExists>account:', account)
    if (account && account.id !== id) {
      return false
    } else {
      return true
    }
  }

  async updateAccountValidations(
    id: string,
    updateAccountDto: UpdateAccountDto
  ) {
    if (updateAccountDto.email) {
      const emailExists = await this.checkEmailBelongsToOtherAccount(
        updateAccountDto.email,
        id
      )
      if (emailExists) {
        this.logger.error('Email is already in use')
        throw new ConflictException('Email is already in use')
      }
    }

    const accountExists = await this.findOne(id)

    if (!accountExists) {
      this.logger.error('Account not found')
      throw new NotFoundException('Account not found')
    }
  }

  removePasswordFromResponse(res) {
    if (res && 'password' in res) {
      delete res.password
    }
    return res
  }

  // async changePasswword(updateAccountDto: UpdateAccountDto, id: string) {
  //   this.logger.info(updateAccountDto, id)
  //   const data = {
  //     ...updateAccountDto
  //   }

  //   const updatedAccount = await this.prisma.account.update({
  //     where: { id },
  //     data
  //   })
  //   return updatedAccount
  // }

  async updateAccount(updateAccountDto: UpdateAccountDto, id: string) {
    try {
      const data = { ...updateAccountDto }
      delete data.oldPassword

      if (data.birthday) {
        const [day, month, year] = data.birthday.toString().split('/')
        const birthday = new Date(`${year}-${month}-${day}`)
        const birthdayISO = birthday.toISOString().split('T')[0]
        data.birthday = new Date(birthdayISO)
      }

      if (updateAccountDto.password) {
        if (!updateAccountDto.oldPassword) {
          this.logger.error('Old password is required')
          throw new BadRequestException('Old password is required')
        }
        const persistedPassword = await this.prisma.account.findUnique({
          where: {
            id
          },
          select: {
            password: true
          }
        })
        const comparePassword = bcrypt.compareSync(
          updateAccountDto.oldPassword,
          persistedPassword.password
        )
        if (!comparePassword) {
          this.logger.error('Password is incorrect')
          throw new BadRequestException('Password is incorrect')
        }
        data.password = bcrypt.hashSync(updateAccountDto.password, 10)
      }

      if (updateAccountDto.photo) {
        this.logger.info(
          'There is a new profile image. Initiating update process...'
        )
        this.logger.info('Checking if there is a previous profile image...')
        const account = await this.prisma.account.findUnique({
          where: {
            id
          },
          select: {
            photo: true
          }
        })
        if (account.photo) {
          this.logger.info(
            'Found previous profile image that needs to be deleted.'
          )
          const photoSubStrings = account.photo.split('/')
          const fileName = photoSubStrings.slice(-2).join('/')
          await this.s3Service.deleteFile(fileName, 'move-other-files')
          this.logger.info('Previous profile image deleted successfully')
        }
        const uploadedFile = await this.s3Service.uploadFile(
          updateAccountDto.photo,
          'move-other-files',
          id
        )
        if (!uploadedFile) {
          this.logger.error('Profile image upload failed')
          throw new InternalServerErrorException('Profile image upload failed')
        }
        this.logger.info('Profile image uploaded successfully')
        data.photo = uploadedFile
      }

      let accountDetailsId = ''
      if (updateAccountDto.objectives) {
        delete data.objectives
        const newAccountDetails =
          await this.accountDetailsService.createOrUpdate(
            'objectives',
            updateAccountDto.objectives,
            id
          )
        accountDetailsId = newAccountDetails.id
      }

      if (updateAccountDto.medicalRestrictions) {
        delete data.medicalRestrictions
        const newAccountDetails =
          await this.accountDetailsService.createOrUpdate(
            'medicalRestrictions',
            updateAccountDto.medicalRestrictions,
            id
          )
        accountDetailsId = newAccountDetails.id
      }

      if (updateAccountDto.interests) {
        delete data.interests
        await this.accountCategoryInterestsService.createOrUpdate(
          updateAccountDto.interests,
          id,
          accountDetailsId
        )
      }

      const updatedAccount = await this.prisma.account.update({
        where: { id },
        data,
        include: {
          ResponsibilityTerm: {
            select: {
              id: true,
              accepted: true,
              responseDate: true
            }
          },
          accountDetails: {
            select: {
              id: true,
              medicalRestrictions: true,
              objectives: true,
              interests: {
                select: {
                  categoryId: true
                }
              }
            }
          }
        }
      })
      return updatedAccount
    } catch (error) {
      this.logger.error(error.message)
      if (notFoundCodes.includes(error.code)) {
        throw new NotFoundException(error.message)
      } else if (constraintErrorCodes.includes(error.code)) {
        throw new BadRequestException(error.message)
      }
      throw new InternalServerErrorException(
        'Something went wrong with the update'
      )
    }
  }

  async sendToken(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const { email } = forgotPasswordDto
      this.logger.info('Checking on database if email exists (is valid)...')
      const accountWithValidEmail = await this.prisma.account.findUniqueOrThrow(
        {
          where: {
            email
          }
        }
      )
      this.logger.info('Email is valid')

      const { token } = await this.passwordResetTokensService.createToken({
        accountId: accountWithValidEmail.id
      })
      this.logger.info('Setting up for email sending...')
      const sendEmailResponse = await this.mailerService.sendEmail(
        accountWithValidEmail.email,
        accountWithValidEmail.name,
        token
      )
      return sendEmailResponse
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.error('Email is not valid')
        throw new NotFoundException('Email is not valid')
      }
      throw new InternalServerErrorException(
        'Something went wrong while executing the forgot password method'
      )
    }
  }

  async verifyToken(verifyToken: VerifyTokenDto) {
    const { email, token } = verifyToken

    let account: Account
    try {
      account = await this.prisma.account.findUniqueOrThrow({
        where: {
          email
        },
        select: {
          id: true
        }
      })
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.error('Account with provided email not found')
        throw new NotFoundException('Account with provided email not found')
      }
    }

    const persistedToken = await this.passwordResetTokensService.findToken(
      account.id
    )
    this.logger.info('Verifying if token is valid...')
    if (Number(token) !== persistedToken.token) {
      this.logger.error('Token is not valid')
      throw new ConflictException('Token is not valid')
    }
    const currentDateTime = new Date(Date.now())
    if (currentDateTime > persistedToken.expiresAt) {
      this.logger.error('Token has expired')
      throw new ConflictException('Token has expired')
    }
    this.logger.info('Token is valid')

    await this.passwordResetTokensService.setTokenAsUsed(account.id)

    return { accountId: account.id, isTokenValid: true }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { accountId, password } = resetPasswordDto
      const hashedPassword = bcrypt.hashSync(password, 10)
      const response = await this.prisma.account.update({
        where: {
          id: accountId
        },
        data: {
          password: hashedPassword
        }
      })
      return this.removePasswordFromResponse(response)
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.error('Account not found')
        throw new NotFoundException('Account not found')
      }
      throw new InternalServerErrorException(
        'Something went wrong while executing the reset password method'
      )
    }
  }
}
