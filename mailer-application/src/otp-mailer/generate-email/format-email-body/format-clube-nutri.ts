import { ContentDto } from 'src/otp-mailer/dto/email-data.dto';
import { CustomContent } from './custom-content.type';

export const formatEmailClubeNutri = (
  content: ContentDto,
  templateHtml: string,
) => {
  const firstName = content.fullName.split(' ')[0];
  const customContent: CustomContent = {
    firstName,
    originApplicationName: 'Clube Nutrição Unida',
    accessCode: content.accessCode,
  };
  const emailBody = Object.entries(customContent).reduce(
    (acc, [placeholder, value]) =>
      acc.replace(new RegExp(`{${placeholder}}`, 'g'), value),
    templateHtml,
  );
  return emailBody;
};
