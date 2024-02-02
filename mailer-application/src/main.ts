import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import pino from 'pino';
import { config as dotenvCOnfig } from 'dotenv';
import * as AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

async function bootstrap() {
  dotenvCOnfig();
  const logger = pino();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mailer Service') // Editar estes campos conforme necessidade
    .setDescription('Multi-service email sender API')
    .setVersion('1.0')
    .addTag('email')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  logger.info(`Application is running on PORT: ${process.env.PORT}`);
}
bootstrap();
