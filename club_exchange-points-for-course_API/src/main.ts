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
    .setTitle('Clube Nutri - Exchange Points for Courses') // Editar estes campos conforme necessidade
    .setDescription(
      'Microsservice that handles the exchange of points for Courses',
    )
    .setVersion('1.0')
    .addTag('points')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  logger.info(`Application is running on PORT: ${process.env.PORT}`);
}
bootstrap();
