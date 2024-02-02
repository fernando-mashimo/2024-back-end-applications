import { Controller, Post, Body } from '@nestjs/common';
import { OtpMailerService } from './otp-mailer.service';
import pino from 'pino';
import { EmailDataDto } from './dto/email-data.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('OTP Mailer')
@Controller('otp-mailer')
export class OtpMailerController {
  private readonly logger = pino();

  constructor(private readonly otpMailerService: OtpMailerService) {}

  @ApiOperation({ summary: 'Multi-origin Email Sender' })
  @ApiInternalServerErrorResponse({
    description:
      'Internal server error: unable to send email due to incomplete processing of required data.',
  })
  @ApiBadRequestResponse({
    description:
      'Bad request: unable to send email due to missing or incompatible data.',
  })
  @ApiCreatedResponse({
    description: 'Email sent successfully.',
    schema: {
      example:
        'Email sent to example@email.com from clubeNutri. Message ID: 0103018c44aaeb28-e0f899e5-f796-4573-95b6-30ccc95301f9-000000',
    },
  })
  @Post('send')
  async sendEmail(@Body() body: EmailDataDto): Promise<string> {
    const { email, origin, content } = body;
    this.logger.info(
      `Initiating email sending process to: ${email} from service: ${origin}`,
    );
    return await this.otpMailerService.sendEmail(email, origin, content);
  }
}
