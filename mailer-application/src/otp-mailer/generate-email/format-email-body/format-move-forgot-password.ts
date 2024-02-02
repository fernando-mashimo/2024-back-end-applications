import { ContentDto } from 'src/otp-mailer/dto/email-data.dto';
import { CustomContent } from './custom-content.type';

export const formatEmailMoveForgotPassword = (
  content: ContentDto,
  templateHtml: string,
) => {
  const firstName = content.fullName.split(' ')[0];
  const customContent: CustomContent = {
    firstName,
    token: content.token.toString(),
  };
  const emailBody = Object.entries(customContent).reduce(
    (acc, [placeholder, value]) =>
      acc.replace(new RegExp(`{${placeholder}}`, 'g'), value),
    templateHtml,
  );
  return emailBody;
};
