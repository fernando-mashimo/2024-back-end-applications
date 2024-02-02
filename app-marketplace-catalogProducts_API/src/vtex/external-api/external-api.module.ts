import { Module } from '@nestjs/common';
import { ExternalApiService } from './external-api.service';

@Module({
  providers: [ExternalApiService],
})
export class ExternalApiModule {}
