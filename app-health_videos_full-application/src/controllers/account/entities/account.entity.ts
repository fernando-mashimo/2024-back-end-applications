export enum AccountType {
  CUSTOMER = 'CUSTOMER',
  PROFESSIONAL = 'PROFESSIONAL'
}

export class Account {
  id?: string
  email?: string
  name?: string
  surname?: string
  photo?: string
  password?: string
  cpf?: string
  accountType?: AccountType
  height?: number
  weight?: number
  birthday?: Date
}
