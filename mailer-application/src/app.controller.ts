import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import pino from 'pino';

@Controller()
export class AppController {
  private readonly logger = pino();
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.info('Initiating health check');
    return this.appService.getHello();
  }
}
