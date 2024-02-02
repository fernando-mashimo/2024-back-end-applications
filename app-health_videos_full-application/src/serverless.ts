import { Handler, Context, Callback } from 'aws-lambda'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { configure as serverlessExpress } from '@vendia/serverless-express'
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import pino from 'pino'
import { ConflictExceptionFilter } from './controllers/account/exceptions/conflict-exception'
import { NotFoundExceptionFilter } from './controllers/account/exceptions/not-found-exception'
import { UnauthorizedExceptionFilter } from './controllers/auth/exceptions/unauthorized-exception'
import { NestExpressApplication } from '@nestjs/platform-express'

let server: Handler

async function bootstrapServer() {
  const logger = pino()

  const applicationOptions: NestApplicationOptions = {
    logger: {
      error: (message) => logger.error(message),
      log: (message) => logger.info(message),
      warn: (message) => logger.warn(message)
    },
    rawBody: true,
    abortOnError: false,
    cors: true
  }

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    applicationOptions
  )

  app.useBodyParser('json', { limit: '10mb' });
  app.useGlobalPipes(new ValidationPipe())

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Move Health')
    .setDescription('Move Health API Documentation')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)

  // Setting HTTP Exceptions that will be filtered
  const globalFilters = [
    ConflictExceptionFilter,
    NotFoundExceptionFilter,
    UnauthorizedExceptionFilter
    // Add more filters if needed
  ]
  globalFilters.forEach((filter) => app.useGlobalFilters(new filter()))

  await app.init()

  const expressApp = app.getHttpAdapter().getInstance()
  return serverlessExpress({ app: expressApp })
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback
) => {
  server = server ?? (await bootstrapServer())

  return server(event, context, callback)
}
