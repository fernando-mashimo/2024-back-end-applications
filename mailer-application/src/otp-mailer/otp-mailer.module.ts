import { Module } from '@nestjs/common';
import { OtpMailerService } from './otp-mailer.service';
import { OtpMailerController } from './otp-mailer.controller';
import { GenerateEmailService } from './generate-email/generateEmail.service';

@Module({
  controllers: [OtpMailerController],
  providers: [OtpMailerService, GenerateEmailService],
})
export class OtpMailerModule {}
