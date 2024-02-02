import { PrismaClient, AccountType, VideoType } from '@prisma/client'
import json from './movehealth_videos.json'

const prisma = new PrismaClient({
  errorFormat: 'pretty',
})

async function main() {

  let professionalAccount = await prisma.account.findFirst({
    where: {
      accountType: AccountType.PROFESSIONAL,
      email: 'jefferson@tecsagroup.com.br',
      name: 'moveAdmin'
    }
  })

  if (!professionalAccount) {
    professionalAccount = await prisma.account.create({
      data: {
        accountType: AccountType.PROFESSIONAL,
        email: 'jefferson@tecsagroup.com.br',
        name: 'moveAdmin'
      }
    })
  }

  for await (const dataJson of json) {

    let category = await prisma.category.findFirst({
      where: {
        title: dataJson.CATEGORIA,
        thumbLandscape: dataJson.THUMBS_CATEG_LANDSCAPE
      }
    })

    if (!category) {
      category = await prisma.category.create({
        data: {
          title: dataJson.CATEGORIA,
          description: '',
          icon: dataJson.CATEGORIA_ICON_URL,
          thumbLandscape: dataJson.THUMBS_CATEG_LANDSCAPE,
          thumbPortrait: dataJson.THUMBS_CATEG_PORTRAIT,
        }
      })
    }

    const videosPromise: any = []

    dataJson.VIDEOS.forEach((video) => {

      const videoGroup: any[] = []
      video.forEach(async (v) => {
        const [name, link] = v.split("|")
        const data = {
          name: name,
          categoryId: category?.id,
          videoType: VideoType.VIDEO,
          accountId: professionalAccount?.id,
          link: link
        } as any

        const videoPromise = await prisma.video.create({
          data: {
            ...data
          }
        })

        videoGroup.push(videoPromise)

      })
      videosPromise.push(videoGroup)

    })


    const videoPlaylist = await prisma.video.create({
      data: {
        name: dataJson.PLAYLIST.split("|")[0],
        categoryId: category.id,
        videoType: 'VIDEO',
        accountId: professionalAccount.id,
        link: dataJson.PLAYLIST.split("|")[1]
      }
    })

    const playlist = await prisma.playlist.create({
      data: {
        name: dataJson.PLAYLIST.split("|")[0],
        description: dataJson['RESUMO DA PLAYLIST'],
        categoryId: category.id,
        videoId: videoPlaylist.id,
        thumb: dataJson['THUMBS PLAYLIST'].split("|")[1]

      }
    })

    const group = await prisma.videoGroup.create({
      data: {
        playlistId: playlist.id,
        classFrequency: 'DAILY',
        name: 'DAILY',
        order: 1
      }
    })

    videosPromise.forEach(async (aulasDia, videoIdx) => {
      const dia = await prisma.videoSubgroup.create({
        data: {
          name: `Dia ${videoIdx + 1}`,
          order: videoIdx + 1,
          videoGroupId: group.id
        }
      })

      aulasDia.forEach(async (aula, aulaIdx) => {
        await prisma.videoSubgroupVideo.create({
          data: {
            order: aulaIdx + 1,
            videoSubgroupId: dia.id,
            videoId: aula.id
          }
        })
      })
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
