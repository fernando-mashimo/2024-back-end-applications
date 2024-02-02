import { Module } from '@nestjs/common';
import { VtexNotificationController } from './vtex-notification.controller';
import { VtexNotificationService } from './vtex-notification.service';
import { SqsService } from 'src/aws/sqs.service';

@Module({
    controllers: [VtexNotificationController],
    providers: [SqsService, VtexNotificationService],
    exports: [SqsService, VtexNotificationService],
  })
export class VtexNotificationModule {}
