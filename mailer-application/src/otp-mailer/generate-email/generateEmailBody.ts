import { S3 } from 'aws-sdk';
import { ContentDto } from '../dto/email-data.dto';
import pino from 'pino';
import { originTemplateURLMapper } from '../utils/origin-app-mapper';
import { formatEmailClubeNutri } from './format-email-body/format-clube-nutri';
import { formatEmailMoveAlert } from './format-email-body/format-move-alert';
import { formatEmailMoveForgotPassword } from './format-email-body/format-move-forgot-password';
import { formatEmailMoveRemindOrCancel } from './format-email-body/format-move-remind-or-cancel';

const logger = pino();

export const generateEmailBody = async (
  origin: string,
  content: ContentDto,
): Promise<string | null> => {
  try {
    const s3 = new S3();
    const s3Bucket = process.env.S3_BUCKET_HTML_TEMPLATE;

    const templateFilePath = originTemplateURLMapper(origin);

    logger.info(`Retrieving email template from provider`);
    const templateResponse = await s3
      .getObject({ Bucket: s3Bucket, Key: templateFilePath })
      .promise();
    if (!templateResponse.Body) {
      logger.error('Error retrieving email template from provider');
      throw new Error('Error retrieving email template from provider');
    }
    logger.info('Email template successfully retrieved');
    const templateHtml: string = templateResponse.Body.toString('utf-8');

    if (origin === 'clubeNutri') {
      const clubeNutriEmailBody = formatEmailClubeNutri(content, templateHtml);
      logger.info('Generated email body for Clube Nutri');
      return clubeNutriEmailBody;
    }

    if (origin === 'FAILED_PAYMENT') {
      const moveEmailBody = formatEmailMoveAlert(content, true, templateHtml);
      logger.info(
        'Generated email body for Move Health - Lembrete de Pagamento',
      );
      return moveEmailBody;
    }

    if (origin === 'LAST_DAY_BEFORE_CANCELLATION') {
      const moveEmailBody = formatEmailMoveAlert(content, false, templateHtml);
      logger.info(
        'Generated email body for Move Health - Lembrete de Pagamento',
      );
      return moveEmailBody;
    }

    if (origin === 'RENOVATION_PLAN' || origin === 'CANCELLATION') {
      const moveEmailBody = formatEmailMoveRemindOrCancel(
        content,
        templateHtml,
      );
      logger.info(
        'Generated email body for Move Health - Lembrete ou Cancelamento',
      );
      return moveEmailBody;
    }

    if (origin === 'MOVE_FORGOT_PASSWORD') {
      const moveEmailBody = formatEmailMoveForgotPassword(
        content,
        templateHtml,
      );
      logger.info(
        'Generated email body for Move Health - Redefinição de Senha',
      );
      return moveEmailBody;
    }

    // adicione mais origens e as respectivas funções de formatação de email, criando um novo arquivo no diretório "format-email-body" quando necessário

    return null;
  } catch (error) {
    logger.error(`An error occurred while generating email body: ${error}`);
    throw new Error(error.message);
  }
};
