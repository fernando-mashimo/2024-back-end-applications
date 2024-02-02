import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';
import { OtpMailerModule } from './otp-mailer/otp-mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    OtpMailerModule,
    // MongooseModule.forRoot(process.env.MONGODB_URI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
