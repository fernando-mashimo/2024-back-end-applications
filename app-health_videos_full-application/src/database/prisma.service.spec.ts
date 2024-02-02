import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from './prisma.service'

describe('Database', () => {
  let provider: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService]
    }).compile()

    provider = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})
