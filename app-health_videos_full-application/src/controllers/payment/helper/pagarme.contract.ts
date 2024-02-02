export namespace Subscription {
  export interface Address {
    street: string
    number: string
    zip_code: string
    neighborhood: string
    city: string
    state: string
    country: string
    complement: string
  }

  export namespace Input {
    export interface Base {
      code: string
      payment_method: string
      currency: string
      interval: string
      interval_count: number
      billing_type: string
      statement_descriptor: string
      billing_day: string
      installments: number
      customer: Customer
      card: Card
      items: Item[]
      metadata: Metadata
    }

    export interface Card {
      number: string
      holder_name: string
      exp_month: number
      exp_year: number
      cvv: string
      billing_address: Address
    }

    export interface Customer {
      name: string
      email: string
      document: string
      document_type: string
      type: string
      phones: Phones
      address: Address
    }

    export interface Phones {
      mobile_phone: MobilePhone
    }

    export interface MobilePhone {
      country_code: string
      area_code: string
      number: string
    }

    export interface Item {
      description: string
      quantity: number
      pricing_scheme: PricingScheme
    }

    export interface PricingScheme {
      price: number
    }

    export interface Metadata {
      customerId: string
    }
  }

  export namespace Output {
    export interface Base {
      id: string
      code: string
      start_at: Date
      interval: string
      interval_count: number
      billing_type: string
      billing_day: number
      current_cycle: CurrentCycle
      next_billing_at: Date
      payment_method: string
      currency: string
      statement_descriptor: string
      installments: number
      status: string
      created_at: Date
      updated_at: Date
      customer: Customer
      card: Card
      items: Item[]
      boleto: Boleto
      metadata: Metadata
    }

    export interface Boleto { }

    export interface Card {
      id: string
      first_six_digits: string
      last_four_digits: string
      brand: string
      holder_name: string
      exp_month: number
      exp_year: number
      status: string
      type: string
      created_at: Date
      updated_at: Date
      billing_address: Address
    }

    export interface CurrentCycle {
      id: string
      start_at: Date
      end_at: Date
      billing_at: Date
      status: string
      cycle: number
    }

    export interface Customer {
      id: string
      name: string
      email: string
      document: string
      document_type: string
      type: string
      delinquent: boolean
      address: Address
      created_at: Date
      updated_at: Date
      phones: Phones
    }

    export interface Address {
      id: string
      line_1?: string
      line_2?: string
      street: string
      number: string
      complement: string
      zip_code: string
      neighborhood: string
      city: string
      state: string
      country: string
      status: string
      created_at: Date
      updated_at: Date
    }

    export interface Phones {
      mobile_phone: MobilePhone
    }

    export interface MobilePhone {
      country_code: string
      number: string
      area_code: string
    }

    export interface Item {
      id: string
      description: string
      quantity: number
      status: string
      created_at: Date
      updated_at: Date
      pricing_scheme: PricingScheme
    }

    export interface PricingScheme {
      price: number
      scheme_type: string
    }

    export interface Metadata {
      customerId: string
    }
  }
}

export namespace PaymentPix {
  export namespace Input {
    export interface Base {
      items: Item[]
      customer: Customer
      payments: Payment[]
    }

    export interface Customer {
      name: string
      email: string
      type: string
      document: string
      phones: Phones
      metadata?: any
    }

    export interface Phones {
      mobile_phone: MobilePhone
    }

    export interface MobilePhone {
      country_code: string
      number: string
      area_code: string
    }

    export interface Item {
      amount: number
      description: string
      quantity: number
    }

    export interface Payment {
      payment_method: string
      pix: Pix
    }

    export interface Pix {
      expires_at: string
      additional_information: AdditionalInformation[]
    }

    export interface AdditionalInformation {
      name: string
      value: string | number
    }
  }

  export namespace Output {
    export interface Base {
      id: string
      code: string
      amount: number
      currency: string
      closed: boolean
      items: Item[]
      customer: Customer
      status: string
      created_at: string
      updated_at: string
      closed_at: string
      charges: Charge[]
    }

    export interface Charge {
      id: string
      code: string
      gateway_id: string
      amount: number
      status: string
      currency: string
      payment_method: string
      created_at: string
      updated_at: string
      customer: Customer
      last_transaction: LastTransaction
    }

    export interface Customer {
      id: string
      name: string
      email: string
      document: string
      document_type: string
      type: string
      delinquent: boolean
      address: { [key: string]: string }
      created_at: string
      updated_at: string
      phones: Phones
    }

    export interface Phones {
      mobile_phone: MobilePhone
    }

    export interface MobilePhone {
      country_code: string
      number: string
      area_code: string
    }

    export interface LastTransaction {
      pix_provider_tid: string
      qr_code: string
      qr_code_url: string
      expires_at: string
      additional_information: AdditionalInformation[]
      id: string
      transaction_type: string
      gateway_id: string
      amount: number
      status: string
      success: boolean
      created_at: string
      updated_at: string
      gateway_response: AntifraudResponse
      antifraud_response: AntifraudResponse
      metadata: AntifraudResponse
    }

    export interface AdditionalInformation {
      name: string
      value: string
    }

    export interface AntifraudResponse {
    }

    export interface Item {
      id: string
      type: string
      description: string
      amount: number
      quantity: number
      status: string
      created_at: string
      updated_at: string
    }

  }

  export namespace Webhook {

    export namespace ChargePaid {
      export interface Base {
        id: string
        code: string
        gateway_id: string
        amount: number
        paid_amount: number
        status: string
        currency: string
        payment_method: string
        paid_at: string
        created_at: string
        updated_at: string
        pending_cancellation: boolean
        customer: Customer
        order: Order
        last_transaction: LastTransaction
        metadata: AntifraudResponseClass
      }

      export interface Customer {
        id: string
        name: string
        email: string
        document: string
        document_type: string
        type: string
        delinquent: boolean
        address: Address
        created_at: string
        updated_at: string
        phones: Phones
        metadata: CustomerMetadata
      }

      export interface Address {
        id: string
        line_1: string
        line_2: string
        street: string
        number: string
        complement: string
        zip_code: string
        neighborhood: string
        city: string
        state: string
        country: string
        status: string
        created_at: string
        updated_at: string
        metadata: AntifraudResponseClass
      }

      export interface AntifraudResponseClass { }

      export interface CustomerMetadata {
        subscriptionId: string
        accountId: string
      }

      export interface Phones {
        mobile_phone: MobilePhone
      }

      export interface MobilePhone {
        country_code: string
        number: string
        area_code: string
      }

      export interface LastTransaction {
        transaction_type: string
        pix_provider_tid: string
        qr_code: string
        qr_code_url: string
        end_to_end_id: string
        payer: Payer
        expires_at: string
        id: string
        gateway_id: string
        amount: number
        status: string
        success: boolean
        created_at: string
        updated_at: string
        gateway_response: AntifraudResponseClass
        antifraud_response: AntifraudResponseClass
        metadata: AntifraudResponseClass
      }

      export interface Payer {
        name: string
        document: string
        document_type: string
        bank_account: BankAccount
      }

      export interface BankAccount {
        bank_name: string
        ispb: string
      }

      export interface Order {
        id: string
        code: string
        amount: number
        closed: boolean
        created_at: string
        updated_at: string
        closed_at: string
        currency: string
        status: string
        customer_id: string
        metadata: AntifraudResponseClass
      }
    }
  }
}
