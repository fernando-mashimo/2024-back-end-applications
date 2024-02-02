import { PrismaClient, AccountType, VideoType } from '@prisma/client'
import { randomUUID } from 'crypto'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  const accountId = randomUUID()
  const categoryId = randomUUID()
  const video1Id = randomUUID()
  const video2Id = randomUUID()
  const playlistId = randomUUID()
  const videoGroupId = randomUUID()
  const videoSubgroupId1 = randomUUID()
  const videoSubgroupId2 = randomUUID()

  await prisma.account.create({
    data: {
      id: accountId,
      accountType: AccountType.PROFESSIONAL,
      photo: faker.internet.avatar(),
      cref: faker.string.alpha({ length: 8 }),
      email: faker.internet.email(),
      name: faker.string.sample()
    }
  })

  await prisma.category.create({
    data: {
      id: categoryId,
      title: faker.string.sample(),
      description: faker.lorem.lines(1)
    }
  })

  await prisma.video.createMany({
    data: [
      {
        id: video1Id,
        link: faker.internet.url(),
        name: faker.lorem.words(2),
        videoType: VideoType.VIDEO,
        accountId: accountId,
        categoryId: categoryId
      },
      {
        id: video2Id,
        link: faker.internet.url(),
        name: faker.lorem.words(2),
        videoType: VideoType.VIDEO,
        accountId: accountId,
        categoryId: categoryId
      }
    ]
  })

  const playlist = await prisma.playlist.create({
    data: {
      id: playlistId,
      name: faker.lorem.word(2),
      description: faker.lorem.lines(1),
      categoryId: categoryId,
      thumb: faker.internet.url(),
      videoId: video1Id
    }
  })

  await prisma.videoSubgroup.createMany({
    data: [
      {
        id: videoSubgroupId1,
        videoId: video1Id,
        name: 'SubGrupo 1'
      },
      {
        id: videoSubgroupId2,
        videoId: video2Id,
        name: 'SubGrupo 2'
      },

    ]
  })

  await prisma.videoGroup.createMany({
    data: [{
      playlistId,
      videoId: video1Id,
      videoSubgroupId: videoSubgroupId1,
    }]
  })




}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
