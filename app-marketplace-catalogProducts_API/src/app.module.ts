import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogProductsModule } from './catalog-products/catalog-products.module';
import { DatabaseModule } from './database/database.module';
import { VtexNotificationService } from './vtex-notification/vtex-notification.service';
import { VtexNotificationController } from './vtex-notification/vtex-notification.controller';
import { VtexNotificationModule } from './vtex-notification/vtex-notification.module';
import { SqsService } from './aws/sqs.service';
import { VtexModule } from './vtex/vtex.module';

@Module({
  imports: [CatalogProductsModule, DatabaseModule, VtexNotificationModule, VtexModule],
  controllers: [AppController, VtexNotificationController],
  providers: [AppService, VtexNotificationService, SqsService],
})
export class AppModule {}
