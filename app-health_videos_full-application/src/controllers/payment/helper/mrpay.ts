// import {
//   InternalServerErrorException,
//   BadRequestException
// } from '@nestjs/common'
// import { AxiosError } from 'axios'
// import { StoreCreditCard } from '../dto'
// import {
//   Payment,
//   INSTALLMENT_TYPE,
//   SOFT_DESCRIPTOR,
//   BRAND_CODE,
//   BRAND,
//   BRAND_NAME
// } from '../entities/mrpay'

// export async function createPaymentTransaction({
//   merchant_order_id,
//   merchant_usn,
//   payment_amount,
//   payment_installments = '1'
// }: Payment.Transaction.Input): Promise<Payment.Transaction.Output.Response> {
//   return this.httpService.axiosRef
//     .post(
//       this.URL_API_MRPAY + '/v1/transactions',
//       {
//         installment_type: INSTALLMENT_TYPE,
//         merchant_order_id,
//         merchant_usn,
//         payment_amount,
//         payment_installments,
//         soft_descriptor: SOFT_DESCRIPTOR
//       },
//       {
//         headers: this.headers
//       }
//     )
//     .then(({ data }) => data)
//     .catch((error: AxiosError) => {
//       const errorDescription = {
//         cause: JSON.stringify(error?.response?.data ?? '{}'),
//         description: JSON.stringify(error?.response?.data ?? '{}')
//       }

//       if (error.status >= 500) {
//         throw new InternalServerErrorException(error.message, {
//           ...errorDescription
//         })
//       }

//       throw new BadRequestException(error.message, {
//         ...errorDescription
//       })
//     })
// }

// export async function makePaymentTransaction(
//   nit: string,
//   { authorizer_id, card }: Payment.Payment.Input
// ): Promise<Payment.Payment.Output.Base> {
//   return this.httpService.axiosRef
//     .post(
//       this.URL_API_MRPAY + `/v1/payments/${nit}`,
//       {
//         authorizer_id,
//         card
//       },
//       {
//         headers: this.headers
//       }
//     )
//     .then(({ data }) => data)
//     .catch((error: AxiosError) => {
//       const errorDescription = {
//         cause: JSON.stringify(error?.response?.data ?? '{}'),
//         description: JSON.stringify(error?.response?.data ?? '{}')
//       }

//       if (error.status >= 500) {
//         throw new InternalServerErrorException(error.message, {
//           ...errorDescription
//         })
//       }

//       throw new BadRequestException(error.message, {
//         ...errorDescription
//       })
//     })
// }

// export async function storeCreditCard(
//   input: StoreCreditCard.Input.Base
// ): Promise<StoreCreditCard.Output.Base> {
//   return this.httpService.axiosRef.post(
//     `${this.URL_API_MRPAY}/v1/cards`,
//     input,
//     {
//       headers: this.headers
//     }
//   )
// }

// export async function payWithStoredCreditCard(
//   nit: string,
//   creditCardToken: string
// ): Promise<StoreCreditCard.Output.Base> {
//   return this.httpService.axiosRef.post(
//     `${this.URL_API_MRPAY}/v1/payment/${nit}`,
//     {
//       authorizer_id: '2',
//       card: {
//         token: creditCardToken
//       },
//       holder: 'Carlos A C Camargo'
//     },
//     {
//       headers: this.headers
//     }
//   )
// }

// export function getAuthorizerId(
//   cardNumber: string
// ): (typeof BRAND_CODE)[keyof typeof BRAND_CODE] {
//   const brand = this.detectCreditCardBrand(cardNumber)

//   console.log({ brand })

//   console.log({ BRAND_CODE: BRAND_CODE[brand] })
//   return BRAND_CODE[brand]
// }

// export function detectCreditCardBrand(cardNumber: string): BRAND {
//   // Remove espaços em branco e caracteres não numéricos do número do cartão
//   const cleanedCardNumber = cardNumber.replace(/\D/g, '')

//   // Verifique as bandeiras com base nos primeiros dígitos do número do cartão
//   if (cleanedCardNumber.startsWith('4')) {
//     return BRAND_NAME.VISA
//   } else if (/^5[1-5]/.test(cleanedCardNumber)) {
//     return BRAND_NAME.MASTERCARD
//   } else if (/^3[47]/.test(cleanedCardNumber)) {
//     return BRAND_NAME['AMERICAN EXPRESS']
//   } else if (
//     /^(?:636368|636369|438935|504175|451416|636297|5067|4576|4011)/.test(
//       cleanedCardNumber
//     )
//   ) {
//     return BRAND_NAME.ELO
//   } else if (/^(606282\d{10}(\d{3})?)|(3841\d{15})/.test(cleanedCardNumber)) {
//     return BRAND_NAME.HIPER
//   } else {
//     console.warn('Bandeira não suportada para o cartão com número: ', {
//       cardNumber
//     })
//     return null // Bandeira não reconhecida
//   }
// }
