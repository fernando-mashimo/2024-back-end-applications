import { Module } from '@nestjs/common';
import { HealthcheckController } from './healthcheck.controller';

@Module({
  controllers: [HealthcheckController],
  providers: [],
})
export class HealthcheckModule {}
