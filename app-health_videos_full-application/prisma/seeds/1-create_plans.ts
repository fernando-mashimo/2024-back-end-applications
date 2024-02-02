import { PrismaClient, AccountType } from '@prisma/client'

const prisma = new PrismaClient({
  errorFormat: 'pretty',
})

async function main() {

  await prisma.plan.createMany({
    data: [
      {
        name: 'Mensal',
        priceInCents: 11880,
        type: 'MONTHLY',
      },
      {
        name: 'Anual',
        priceInCents: 8280,
        type: 'YEARLY',
      }
    ]
  })

}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
