export class PasswordResetToken {
  id: string
  accountId: string
  token: number
  createdAt: Date
  expiresAt: Date
  isUsed: boolean
}
