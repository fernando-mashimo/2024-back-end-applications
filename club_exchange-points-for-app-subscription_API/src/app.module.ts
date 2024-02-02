import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';
import { AppSubscriptionOrdersModule } from './app-subscription-orders/app-subscription-orders.module';
// import { AppSubscriptionOrderSchema } from './app-subscription-orders/schema/app-subscription-order.schema';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AppSubscriptionOrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
