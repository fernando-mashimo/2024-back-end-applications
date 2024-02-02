import { Test, TestingModule } from '@nestjs/testing'
import { VideoSubgroupController } from './videoSubgroup.controller'
import { VideoSubgroupService } from './videoSubgroup.service'

describe('VideoSubgroupController', () => {
  let controller: VideoSubgroupController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoSubgroupController],
      providers: [VideoSubgroupService]
    }).compile()

    controller = module.get<VideoSubgroupController>(VideoSubgroupController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
