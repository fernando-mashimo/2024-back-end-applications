import { NotificationDto } from './dto/notification.dto';
import { VtexNotificationService } from './vtex-notification.service';
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';

@Controller('api/notification')
export class VtexNotificationController {
  constructor(
    private readonly vtexNotificationService: VtexNotificationService,
  ) {}

  @Post()
  handleNotification(@Body(new ValidationPipe()) payload: NotificationDto) {
    const result =
      this.vtexNotificationService.processCatalogNotification(payload);

    return result;
  }
}
