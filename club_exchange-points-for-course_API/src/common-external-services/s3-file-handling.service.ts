import { InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import pino from 'pino';

class S3Service {
  private s3: AWS.S3;
  private readonly logger = pino();
  constructor() {
    this.s3 = new AWS.S3();
  }

  async uploadFile(
    file: Express.Multer.File,
    bucketName: string,
  ): Promise<string> {
    try {
      this.logger.info('Initiating S3 file upload...');
      const params: AWS.S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: `${new Date().toISOString()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const result = await this.s3.upload(params).promise();
      if (!result) {
        throw new InternalServerErrorException('S3 file upload error');
      }
      this.logger.info('S3 file upload completed');
      return result.Location; // Returns the URL of the uploaded file
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}

export default S3Service;
