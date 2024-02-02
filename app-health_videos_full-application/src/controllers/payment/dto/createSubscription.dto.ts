import { Plan } from '@prisma/client'
import { PaymentPix } from '../helper/pagarme.contract'

export type INTERVAL = 'month' | 'year'
export type INSTALLMENTS = 12 | 1

export interface CreateSubscriptionsDto {
  plan: {
    interval: INTERVAL
    installments: INSTALLMENTS
    price: number
    name: string
  }
  card: Subscription.Input.Card
  billingAddress: Subscription.Input.Address
  customer: {
    name: string
    email: string
    phone: {
      area_code: string
      number: string
    }
    address: Subscription.Input.Address
  }
  subscriptionId: string
}

export interface CreatePaymentDto {
  planId: string
  accountId: string
}

export class Metadata {
  [key: string]: string
}

export class CustomerIdMetadata extends Metadata {
  customerId: string
}

export const makePaymentCreditCard = () => { }

export const makePaymentPix = (
  plan: Plan,
  daysToExpire = 5
): PaymentPix.Input.Payment => {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + daysToExpire)

  return {
    payment_method: 'pix',
    pix: {
      expires_at: expiresAt.toISOString(),
      additional_information: [
        {
          name: 'planId',
          value: plan.id
        },
        {
          name: 'priceInCents',
          value: plan.priceInCents
        },
        {
          name: 'planType',
          value: plan.type
        }
      ]
    }
  }
}

export const makeSubscription = ({
  billingAddress,
  card,
  customer,
  plan,
  subscriptionId
}: CreateSubscriptionsDto): Subscription.Input.Base => {
  const today = new Date()

  return {
    code: subscriptionId,
    payment_method: 'credit_card',
    currency: 'BRL',
    interval: plan.interval,
    installments: plan.installments,
    interval_count: 1,
    billing_type: plan.interval === 'month' ? 'exact_day' : 'prepaid',
    billing_day:
      plan.interval === 'month' ? today.getDate().toString() : undefined,
    customer: {
      name: customer.name,
      email: customer.email,
      address: billingAddress,
      phones: {
        mobile_phone: {
          country_code: '55',
          area_code: customer.phone.area_code,
          number: customer.phone.number
        }
      }
    },
    card: {
      ...card,
      billing_address: {
        ...billingAddress
      }
    },
    items: [
      {
        description: plan.name,
        quantity: 1,
        pricing_scheme: {
          price: plan.price
        }
      }
    ],
    metadata: {
      customerId: subscriptionId
    }
  }
}

export const makeSubscriptionPix = (
  customer: PaymentPix.Input.Customer,
  plan: Plan
): PaymentPix.Input.Base => {
  return {
    items: [
      {
        amount: plan.priceInCents,
        description: plan.name,
        quantity: 1
      }
    ],
    customer: {
      name: customer.name,
      email: customer.email,
      type: customer.type,
      document: customer.document,
      phones: customer.phones,
      metadata: customer.metadata
    },
    payments: [makePaymentPix(plan)]
  }
}

export namespace Subscription {
  export namespace Input {
    export interface Card {
      number: string
      holder_name: string
      exp_month: number
      exp_year: number
      cvv: string
      billing_address: Address
    }

    export interface Item {
      description: string
      quantity: number
      pricing_scheme: {
        price: number
      }
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
    }

    export interface Phone {
      country_code: string
      area_code: string
      number: string
    }

    export interface Base {
      code: string
      payment_method: string
      currency: string
      interval: INTERVAL
      interval_count: number
      billing_type: string
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
      address: Address
      phones: {
        mobile_phone: Phone
      }
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
      delinquent: boolean
      address: Address
      created_at: Date
      updated_at: Date
      phones: Phones
    }

    export interface Address {
      id: string
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
