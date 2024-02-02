import { ContentDto } from 'src/otp-mailer/dto/email-data.dto';
import { CustomContent } from './custom-content.type';

export const formatEmailMoveAlert = (
  content: ContentDto,
  isFirstTrial: boolean,
  templateHtml: string,
) => {
  const firstName = content.fullName.split(' ')[0];
  const customContent: CustomContent = {
    amountToPay: `R$ ${content.amountToPay.toFixed(2)}`.replace('.', ','),
    firstName,
    paymentURL: content.paymentURL,
  };
  if (!isFirstTrial) {
    const currentDate = new Date();
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + parseInt(process.env.DAYS_TO_PAY));
    const formattedDueDate = nextDay.toLocaleDateString('en-GB');
    customContent.dueDate = formattedDueDate;
  }

  const emailBody = Object.entries(customContent).reduce(
    (acc, [placeholder, value]) =>
      acc.replace(new RegExp(`{${placeholder}}`, 'g'), value),
    templateHtml,
  );
  return emailBody;
};
