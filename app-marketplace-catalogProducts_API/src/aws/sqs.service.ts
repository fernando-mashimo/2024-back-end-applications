import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class SqsService {
  private readonly sqs = new AWS.SQS();

  async sendMessage(queueUrl: string, messageBody: string): Promise<void> {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: messageBody,
    };

    try {
        await this.sqs.sendMessage(params).promise();
    } catch(error) {
        console.log(error);
        
    }
  }
}
