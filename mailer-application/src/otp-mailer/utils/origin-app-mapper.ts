export const originTemplateURLMapper = (origin: string): string => {
  switch (origin) {
    case 'clubeNutri':
      return process.env.CLUB_NUTRI_HTML_PATH;
    case 'RENOVATION_PLAN':
      return process.env.MOVE_HTML_PATH;
    case 'FAILED_PAYMENT':
      return process.env.MOVE_1ST_ALERT_HTML_PATH;
    case 'LAST_DAY_BEFORE_CANCELLATION':
      return process.env.MOVE_2ND_ALERT_HTML_PATH;
    case 'CANCELLATION':
      return process.env.MOVE_CANCEL_HTML_PATH;
    case 'MOVE_FORGOT_PASSWORD':
      return process.env.MOVE_FORGOT_PASSWORD_HTML_PATH;
    // Incluir novas origens e respectivos nomes de arquivo HTML, conforme necessidade
  }
};

export const appSenderAddressMapper = (origin: string): string => {
  switch (origin) {
    case 'clubeNutri':
      return process.env.CLUB_NUTRI_SENDER;
    case 'RENOVATION_PLAN':
      return process.env.MOVE_SENDER;
    case 'FAILED_PAYMENT':
      return process.env.MOVE_SENDER;
    case 'LAST_DAY_BEFORE_CANCELLATION':
      return process.env.MOVE_SENDER;
    case 'CANCELLATION':
      return process.env.MOVE_SENDER;
    case 'MOVE_FORGOT_PASSWORD':
      return process.env.MOVE_SENDER;
    // Incluir novas origens e respectivos endereços de e-mail do remetente, conforme necessidade
  }
};
