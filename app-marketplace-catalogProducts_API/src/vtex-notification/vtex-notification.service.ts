import { Injectable } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { SqsService } from 'src/aws/sqs.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class VtexNotificationService {
  constructor(private readonly sqsService: SqsService) {}
  async processCatalogNotification(payload: NotificationDto): Promise<string> {
    try {
      await this.sqsService.sendMessage(
        process.env.QUEUE_SQS,
        JSON.stringify(payload),
      );
      console.log(`Notificação do catálogo processada com sucesso: ${JSON.stringify(payload)}`);

      return `Notificação do catálogo processada com sucesso: ${payload}`;
    } catch(error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
