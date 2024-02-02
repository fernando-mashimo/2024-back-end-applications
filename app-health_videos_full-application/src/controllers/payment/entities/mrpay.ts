/**
 *
 */
export const SOFT_DESCRIPTOR = 'MOVEHEALTH' as const

/**
 * INSTALLMENT_TYPE = 4
 * custo do parcelamento para o logista
 */
export const INSTALLMENT_TYPE = '4' as const

export namespace Payment {
  export type Create = Card.Input & Transaction.Input
  export namespace Card {
    export interface Input {
      authorizer_id: string
      card: Card
    }

    export interface Card {
      number: string
      expiry_date: string
      security_code: string
      holder: string
    }
  }

  export namespace Store {
    export namespace Input {
      export interface Card {
        card: Card
        authorizer_idd: string
        merchant_usn: string
        customer_id: string
      }
    }

    export namespace Output {
      export interface Card {
        code: string
        message: string
        card: {
          token: string
          suffix: string
          bin: string
        }
        store: {
          status: string
          nsua: string
          nita: string
          merchant_usn: string
          customer_id: string
          authorizer_id: string
        }
      }
    }
  }

  export namespace Transaction {
    export interface Input {
      merchant_usn: string
      merchant_order_id: string
      soft_descriptor: string
      payment_installments: string
      installment_type: string
      payment_amount: string
    }

    export namespace Output {
      export interface Response {
        code: string
        message: string
        payment: Payment
      }

      export interface Payment {
        status: string
        nit: string
        merchant_order_id: string
        merchant_usn: string
        payment_amount: string
      }
    }
  }

  export namespace Payment {
    export namespace Output {
      export interface Base {
        code: string
        message: string
        payment: Payment
      }

      export interface Payment {
        authorizer_code: string
        authorizer_message: string
        status: string
        nit: string
        merchant_order_id: string
        authorizer_id: string
        acquirer_id: string
        acquirer_name: string
        merchant_usn: string
        emrpay_usn: string
        payment_amount: string
        payment_type: string
        payment_date: string
      }

      export interface Payment1 extends Payment {
        authorizer_date: string
        authorization_number: string
        host_usn: string
        issuer: string
        terminal_id: string
      }
    }

    export interface Input {
      authorizer_id: string
      card: Card
    }

    export interface Card {
      number: string
      expiry_date: string
      security_code: string
      holder: string
    }
  }
}

export enum BRAND_NAME {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  'AMERICAN EXPRESS' = 'AMERICAN EXPRESS',
  HIPER = 'HIPER',
  ELO = 'ELO',
  PIX = 'PIX'
}

export const BRAND_CODE = {
  VISA: 1,
  MASTERCARD: 2,
  'AMERICAN EXPRESS': 3,
  HIPER: 5,
  ELO: 41,
  PIX: 440
}

export type BRAND =
  | 'VISA'
  | 'MASTERCARD'
  | 'AMERICAN EXPRESS'
  | 'HIPER'
  | 'ELO'
  | 'PIX'
