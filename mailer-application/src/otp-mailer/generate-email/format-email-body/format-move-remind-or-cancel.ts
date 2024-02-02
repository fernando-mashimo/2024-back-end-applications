import { ContentDto } from 'src/otp-mailer/dto/email-data.dto';

export const formatEmailMoveRemindOrCancel = (
  content: ContentDto,
  templateHtml: string,
) => {
  const firstName = content.fullName.split(' ')[0];
  const emailBody = templateHtml.replace('{firstName}', firstName);
  return emailBody;
};
