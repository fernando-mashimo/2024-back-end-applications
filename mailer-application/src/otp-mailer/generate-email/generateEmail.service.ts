import pino from 'pino';
import { generateEmailParams } from './generateEmailParams';
import { ContentDto } from '../dto/email-data.dto';
import { generateEmailBody } from './generateEmailBody';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SendEmailRequest } from 'aws-sdk/clients/ses';

@Injectable()
export class GenerateEmailService {
  private readonly logger = pino();

  async generateEmail(to: string, origin: string, content: ContentDto) {
    const emailBody = await generateEmailBody(origin, content);
    if (!emailBody) {
      this.logger.error('Missing data to generate email body.');
      throw new BadRequestException('Missing data to generate email body.');
    }

    const params: SendEmailRequest = generateEmailParams(to, emailBody, origin);
    return { params };
  }
}
