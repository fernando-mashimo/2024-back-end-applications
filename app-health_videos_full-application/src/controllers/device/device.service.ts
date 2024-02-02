import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { AccountService } from 'src/controllers/account/account.service'
import { CreateAccountDto } from 'src/controllers/account/dto/create-account.dto'
import { PrismaService } from '@src/database/prisma.service'
import { NotFound } from 'src/errors'
import { CreateDeviceDto } from './dto/create-device.dto'
import { GetDeviceResponseDto } from './dto/get-device-response.dto'
import { GetDeviceDto } from './dto/get-device.dto'

@Injectable()
export class DeviceService {
  constructor(
    private prisma: PrismaService,
    private accountService: AccountService
  ) {}

  private readonly logger = new Logger(DeviceService.name)

  async create(createDeviceDto: CreateDeviceDto) {
    // const macAddressExist = await this.macAddressExists(createDeviceDto.macAddress)
    // if(macAddressExist){
    //   throw new BadRequest("MacAddress already exists")
    // }
    // const createdAccountId = await this.createAccountForDevice()
    // const deviceDto = {
    //   ...createDeviceDto,
    //   accountId: createdAccountId,
    //   active: true
    // }
    // const createdDevice = await this.prisma.device.create({
    //   data: deviceDto
    // }).catch( (error) => {
    //   this.logger.error(error)
    //   throw new BadRequest("Error creating device")
    // })
    // return createdDevice;
  }

  // async macAddressExists(address: string) {
  //   this.logger.debug('macAddressExists(address)', address)
  //   const device = await this.findByMacAddress(address)
  //   this.logger.log('device:', device)
  //   if (device) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  // async createAccountForDevice() {
  //   // : Promise<string>
  //   const accDto = new CreateAccountDto()
  //   // accDto.accountType = AccountType.Customer
  //   this.logger.log('accDto:', accDto)
  //   const createdAccount = await this.accountService.create(accDto)
  //   // return createdAccount.id
  // }

  // async findAll() {
  //   const devices = await this.prisma.device.findMany()
  //   return devices
  // }

  // async findOne(id: string, params: GetDeviceDto) {
  //   this.logger.log('params', params)

  //   const device = await this.prisma.device
  //     .findUnique({
  //       where: {
  //         id,
  //         macAddress: params.macAddress,
  //         accountId: params.accountId
  //       }
  //     })
  //     .then((res) => {
  //       if (!res) {
  //         throw new NotFound('Device not found')
  //       } else {
  //         return res
  //       }
  //     })
  //   return device
  // }

  // async findByMacAddress(address: string): Promise<GetDeviceResponseDto> {
  //   const device = await this.prisma.device
  //     .findFirst({
  //       where: {
  //         macAddress: address
  //       }
  //     })
  //     .then((res) => {
  //       this.logger.debug('res', res)
  //       return res
  //     })
  //     .catch((error) => {
  //       this.logger.error(error)
  //       throw new InternalServerErrorException('Error getting mac address')
  //     })

  //   return device
  // }

  // async findByAccountId(account_id: string): Promise<GetDeviceResponseDto> {
  //   const device = await this.prisma.device.findFirst({
  //     where: {
  //       accountId: account_id,
  //       active: true
  //     }
  //   })

  //   return device
  // }

  // async findByDeviceId(id: string): Promise<GetDeviceResponseDto> {
  //   const device = await this.prisma.device.findUnique({
  //     where: {
  //       id
  //     }
  //   })

  //   return device
  // }
}
