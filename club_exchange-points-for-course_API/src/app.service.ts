import { Injectable } from '@nestjs/common';
import pino from 'pino';

@Injectable()
export class AppService {
  private readonly logger = pino();
  getHello(): string {
    this.logger.info('Health check OK');
    return 'Hello World!';
  }
}
