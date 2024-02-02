import { PaymentPix } from '../helper/pagarme.contract'



export class ChargePaidDto {
  data: PaymentPix.Webhook.ChargePaid.Base
}
