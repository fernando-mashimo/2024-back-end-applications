export namespace Payment {
  export namespace Input {
    export interface Base {
      customer: Customer
      items: Item[]
      payments: Payment[]
    }

    export interface Customer {
      phones: Phones
      name: string
      email: string
      type: string
      document: string
      document_type: string
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
      amount: number
      description: string
      quantity: number
      code: number
    }

    export interface Payment {
      payment_method: string
      credit_card: CreditCard
    }

    export interface CreditCard {
      installments: number
      statement_descriptor: string
      card: Card
    }

    export interface Card {
      number: string
      holder_name: string
      exp_month: number
      exp_year: number
      cvv: string
      billing_address: Address
    }

    export interface Address {
      street: string
      number: string
      zip_code: string
      neighborhood: string
      city: string
      state: string
      country: string
      complement: string
      line1: string
      line2: string
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
      created_at: Date
      updated_at: Date
      closed_at: Date
      charges: Charge[]
      checkouts: any[]
    }

    export interface Charge {
      id: string
      code: string
      gateway_id: string
      amount: number
      paid_amount: number
      status: string
      currency: string
      payment_method: string
      paid_at: Date
      created_at: Date
      updated_at: Date
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
      created_at: Date
      updated_at: Date
      phones: Phones
    }

    export interface Phones {
      home_phone: EPhone
      mobile_phone: EPhone
    }

    export interface EPhone {
      country_code: string
      number: string
      area_code: string
    }

    export interface LastTransaction {
      id: string
      transaction_type: string
      gateway_id: string
      amount: number
      status: string
      success: boolean
      installments: number
      statement_descriptor: string
      acquirer_name: string
      acquirer_tid: string
      acquirer_nsu: string
      acquirer_auth_code: string
      acquirer_message: string
      acquirer_return_code: string
      operation_type: string
      card: Card
      funding_source: string
      created_at: Date
      updated_at: Date
      gateway_response: GatewayResponse
      antifraud_response: AntifraudResponse
      metadata: Metadata
    }

    export interface AntifraudResponse {
      status: string
      score: string
      provider_name: string
    }

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
      billing_address: BillingAddress
    }

    export interface BillingAddress {
      street: string
      number: string
      complement: string
      zip_code: string
      neighborhood: string
      city: string
      state: string
      country: string
      line_1: string
      line_2: string
    }

    export interface GatewayResponse {
      code: string
      errors: any[]
    }

    export interface Metadata {
    }

    export interface Item {
      id: string
      type: string
      description: string
      amount: number
      quantity: number
      status: string
      created_at: Date
      updated_at: Date
      code: string
    }

  }
}