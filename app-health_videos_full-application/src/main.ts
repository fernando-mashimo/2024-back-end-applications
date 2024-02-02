import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import pino from 'pino'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConflictExceptionFilter } from './controllers/account/exceptions/conflict-exception'
import { NotFoundExceptionFilter } from './controllers/account/exceptions/not-found-exception'
import { UnauthorizedExceptionFilter } from './controllers/auth/exceptions/unauthorized-exception'
import * as AWS from 'aws-sdk'
import { NestExpressApplication } from '@nestjs/platform-express'

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

async function bootstrap() {
  const logger = pino()

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: {
    //   error: (message) => logger.error(message),
    //   log: (message) => logger.info(message),
    //   warn: (message) => logger.warn(message)
    // },
    rawBody: true,
    abortOnError: false
  })

  app.enableVersioning({
    type: VersioningType.URI
  })

  app.useBodyParser('json', { limit: '10mb' });
  app.useGlobalPipes(new ValidationPipe())

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Move Health') // Editar estes campos conforme necessidade
    .setDescription('Move Health API')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)

  // Setting Exceptions
  const globalFilters = [
    ConflictExceptionFilter,
    NotFoundExceptionFilter,
    UnauthorizedExceptionFilter
    // Add more filters if needed
  ]
  globalFilters.forEach((filter) => app.useGlobalFilters(new filter()))

  await app.listen(process.env.APP_PORT || 3000)
  logger.info(`Application is running on port: ${process.env.APP_PORT || 3000}`)
}
bootstrap()
