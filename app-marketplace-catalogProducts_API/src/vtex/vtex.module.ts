import { Module } from '@nestjs/common';
import { VtexService } from './vtex.service';
import { VtexController } from './vtex.controller';
import { ExternalApiModule } from './external-api/external-api.module';
import { ExternalApiService } from './external-api/external-api.service';

@Module({
  imports: [ExternalApiModule],
  controllers: [VtexController],
  providers: [VtexService, ExternalApiService],
})
export class VtexModule {}
