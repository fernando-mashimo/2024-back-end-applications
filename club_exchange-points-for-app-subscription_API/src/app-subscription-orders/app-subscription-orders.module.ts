import { Module } from '@nestjs/common';
import { AppSubscriptionOrdersService } from './app-subscription-orders.service';
import { AppSubscriptionOrdersController } from './app-subscription-orders.controller';
import { DatabaseModule } from 'src/database/database.module';
import { generalProviders } from 'src/database/general.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [AppSubscriptionOrdersController],
  providers: [AppSubscriptionOrdersService, ...generalProviders],
})
export class AppSubscriptionOrdersModule {}
