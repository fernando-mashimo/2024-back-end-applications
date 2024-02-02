export enum ApiKeyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED'
}

export class ApiKey {
  id: string
  key: string
  holder: string
  status: ApiKeyStatus
  createdAt: Date
}

export class VerifyApiKeyResponseDto {
  isValid: boolean
  holder: string
}
