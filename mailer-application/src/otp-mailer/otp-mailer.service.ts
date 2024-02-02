import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import pino from 'pino';
import { ContentDto } from './dto/email-data.dto';
import { GenerateEmailService } from './generate-email/generateEmail.service';

@Injectable()
export class OtpMailerService {
  private readonly ses = new AWS.SES({ apiVersion: '2010-12-01' });
  private readonly logger = pino();

  constructor(private readonly generateEmailService: GenerateEmailService) {}

  async sendEmail(
    to: string,
    origin: string,
    content: ContentDto,
  ): Promise<string> {
    try {
      const email = await this.generateEmailService.generateEmail(
        to,
        origin,
        content,
      );

      this.logger.info('Requesting email service provider to send email.');
      const sendResponse = await this.ses.sendEmail(email.params).promise();
      if (sendResponse.MessageId) {
        this.logger.info(
          `Email sent to ${to} from ${origin}. Message ID: ${sendResponse.MessageId}`,
        );
        return `Email sent to ${to} from ${origin}. Message ID: ${sendResponse.MessageId}`;
      } else {
        this.logger.warn(`Unable to send email to recipient`);
        return 'Unable to send email to recipient';
      }
    } catch (error) {
      this.logger.error(
        `An error occurred while sending the email: ${error.message}`,
      );
      throw new Error('An error occurred while sending the email.');
    }
  }
}
