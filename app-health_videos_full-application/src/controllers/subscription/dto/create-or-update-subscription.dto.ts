import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateOrUpdateSubscriptionDto {
  @ApiProperty({
    description: 'Subscription plan term in months (1, 6 ou 12) or free',
    type: String,
    example: 'mensal'
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['free', 'mensal', 'trimestral', 'semestral', 'anual'], {
    message: 'plan_mode must be mensal, trimestral, semestral, anual or free'
  })
  plan_mode: string

  @ApiProperty({
    description: 'Subscription plan status (active or inactive)',
    type: String,
    example: 'active'
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['active', 'inactive'], {
    message: 'Status must be active or inactive'
  })
  status: string

  @ApiProperty({
    description: 'Api Key required to create or update subscription'
  })
  @IsNotEmpty()
  @IsUUID()
  apiKey: string
}
