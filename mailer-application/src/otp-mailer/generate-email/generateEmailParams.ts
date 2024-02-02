import { SendEmailRequest } from 'aws-sdk/clients/ses';
import { appSenderAddressMapper } from '../utils/origin-app-mapper';

export const generateEmailParams = (
  recipient: string,
  emailBody: string,
  origin: string,
): SendEmailRequest => {
  const appSenderAddress = appSenderAddressMapper(origin);

  let subject = '';
  switch (origin) {
    case 'clubeNutri':
      subject = 'Seu código de acesso ao Clube Nutrição Unida';
      break;
    case 'RENOVATION_PLAN':
      subject = 'Seu lembrete para Renovação';
      break;
    case 'FAILED_PAYMENT':
      subject = 'Move Health - Não identificamos seu pagamento';
      break;
    case 'LAST_DAY_BEFORE_CANCELLATION':
      subject = 'Move Health - Mantenha seu acesso ao app';
      break;
    case 'CANCELLATION':
      subject = 'Move Health - Encerramento de Plano';
      break;
    case 'MOVE_FORGOT_PASSWORD':
      subject = 'Move Health - Redefinição de Senha';
      break;
    // adicione outras origens e seus respectivos subjects
  }

  return {
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Html: {
          Data: emailBody,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: appSenderAddress, // Configure o endereço de email do remetente, deve estar habilitado no serviço AWS SES
  };
};
