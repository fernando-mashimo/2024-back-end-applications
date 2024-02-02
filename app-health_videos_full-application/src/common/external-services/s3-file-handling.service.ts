import { InternalServerErrorException } from '@nestjs/common'
import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand
} from '@aws-sdk/client-s3'
import pino from 'pino'

class S3Service {
  private s3: S3Client
  private readonly logger = pino()
  constructor() {
    this.s3 = new S3Client({})
  }

  async uploadFile(
    fileBase64: string,
    bucketName: string,
    id: string
  ): Promise<string> {
    try {
      this.logger.info('Initiating S3 file upload')
      const file = Buffer.from(fileBase64, 'base64')
      const key = `profileImages/${new Date().toISOString()}_${id}.png`
      const params = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: 'image/png'
      })
      const result = await this.s3.send(params)
      if (!result) {
        throw new InternalServerErrorException('S3 file upload error')
      }
      this.logger.info('S3 file upload completed')
      return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` // Returns the URL of the uploaded file
    } catch (error) {
      this.logger.error(error.message)
      throw new InternalServerErrorException(error.message)
    }
  }

  async deleteFile(fileName: string, bucketName: string) {
    const params = {
      Bucket: bucketName,
      Key: fileName
    }
    this.logger.info('Initiating S3 file deletion...')
    const result = await this.s3.send(new DeleteObjectCommand(params))
    if (result.$metadata.httpStatusCode !== 204) {
      this.logger.error('S3 file deletion error')
      throw new InternalServerErrorException('S3 file deletion error')
    }
    this.logger.info('S3 file deletion completed')
  }
}

export default S3Service
