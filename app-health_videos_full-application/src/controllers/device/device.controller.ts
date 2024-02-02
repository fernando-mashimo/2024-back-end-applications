import { Body, Controller, Get, Logger, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { routes } from '@src/common/baseRoutes';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { GetDeviceDto } from './dto/get-device.dto';

@Controller(routes.device)
export class DeviceController {
  // constructor(private readonly deviceService: DeviceService) { }

  // private readonly logger = new Logger(DeviceController.name)

  // @Post()
  // create(@Body() createDeviceDto: CreateDeviceDto) {
  //   this.logger.log("createDeviceDto:", createDeviceDto)
  //   return this.deviceService.create(createDeviceDto);
  // }

  // // TODO: Remover método, pois é utilizado somente para testes
  // @Get()
  // findAll() {
  //   return this.deviceService.findAll();
  // }

  // @Get(':id')
  // async findById(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Query() query: GetDeviceDto
  // ) {
  //   return this.deviceService.findOne(id, query);
  // }


}
