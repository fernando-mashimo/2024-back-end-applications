import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { routes } from '@src/common/baseRoutes';
import { PublicEndpoint } from '@src/helpers/public-endpoint';

@Controller(routes.healthcheck)
@ApiTags('Health')
export class HealthcheckController {
  @Get()
  @PublicEndpoint()
  @HttpCode(200)
  checkStatus() {
    return "OK"
  }
}
