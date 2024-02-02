import { PrismaClient, AccountType, VideoType } from '@prisma/client'

const prisma = new PrismaClient({
  errorFormat: 'pretty',
})

async function main() {

  const professionalAccount = await prisma.account.upsert({
    where: {
      email: 'jefferson@tecsagroup.com.br',
    },
    create: {
      accountType: AccountType.PROFESSIONAL,
      email: 'jefferson@tecsagroup.com.br',
      name: 'moveAdmin',
    },
    update: {
      email: 'jefferson@tecsagroup.com.br',
    }
  })


  let category = await prisma.category.findFirst({
    where: {
      title: 'SHORT',
    }
  })

  if (!category) {
    category = await prisma.category.create({
      data: {
        title: 'SHORT',
        description: '',
        icon: '',
        thumbLandscape: '',
        thumbPortrait: '',
      }
    })
  }


  const shortsData = [
    { name: 'Flavio', link: 'https://videos-move.s3.amazonaws.com/shorts/flaviolealtf_video_1690470072692.mp4' },
    { name: 'IMG_4461.MOV', link: 'https://videos-move.s3.amazonaws.com/shorts/IMG_4461.MOV' },
    { name: 'IMG_4581.MOV', link: 'https://videos-move.s3.amazonaws.com/shorts/IMG_4581.MOV' },
    { name: 'IMG_4595.MOV', link: 'https://videos-move.s3.amazonaws.com/shorts/IMG_4595.MOV' },
    { name: 'IMG_4624.MOV', link: 'https://videos-move.s3.amazonaws.com/shorts/IMG_4624.MOV' },
    { name: 'lv_0_20230510085501.mp4', link: 'https://videos-move.s3.amazonaws.com/shorts/lv_0_20230510085501.mp4' },
    { name: 'lv_0_20230822074138.mp4', link: 'https://videos-move.s3.amazonaws.com/shorts/lv_0_20230822074138.mp4' },
    { name: 'lv_0_20230822074718.mp4', link: 'https://videos-move.s3.amazonaws.com/shorts/lv_0_20230822074718.mp4' },
    { name: 'Miranda', link: 'https://videos-move.s3.amazonaws.com/shorts/Shorts+-+Miranda+-+3.mp4' },
    { name: 'Miranda', link: 'https://videos-move.s3.amazonaws.com/shorts/Shorts+-+Miranda+-+4.mp4' },
    { name: 'Juliano', link: 'https://videos-move.s3.amazonaws.com/shorts/Shorts+miranda+2.mp4' },
    { name: 'Juliano', link: 'https://videos-move.s3.amazonaws.com/shorts/Shorts_Juliano_1.mp4' },
    { name: 'Juliano', link: 'https://videos-move.s3.amazonaws.com/shorts/Shorts_Juliano_2.mp4' },
    { name: 'Juliano', link: 'https://videos-move.s3.amazonaws.com/shorts/Shorts_Juliano_3.mp4' },
    { name: 'Juliano', link: 'https://videos-move.s3.amazonaws.com/shorts/Shorts_Juliano_4.mp4' },
    { name: 'Juliano', link: 'https://videos-move.s3.amazonaws.com/shorts/Shorts_Juliano_5.mp4' },
    { name: 'Juliano', link: 'https://videos-move.s3.amazonaws.com/shorts/Shorts_Juliano_6.mp4' },
    { name: 'Juliano', link: 'https://videos-move.s3.amazonaws.com/shorts/Shorts_Juliano_7.mp4' },
    { name: 'Juliano', link: 'https://videos-move.s3.amazonaws.com/shorts/Shorts_Juliano_8.mp4' },
    { name: 'Miranda', link: 'https://videos-move.s3.amazonaws.com/shorts/Video+Miranda+1.mp4' }
  ]



  for await (const video of shortsData) {
    console.log({ professionalAccount })

    await prisma.video.create({
      data:
      {
        accountId: professionalAccount.id,
        name: video.name,
        link: video.link,
        categoryId: category.id,
        videoType: VideoType.SHORT,
      },

    })
  }



}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
