import { Test, TestingModule } from '@nestjs/testing'
import { VideoGroupController } from './videoGroup.controller'
import { VideoGroupService } from './videoGroup.service'

describe('VideoGroupController', () => {
  let controller: VideoGroupController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoGroupController],
      providers: [VideoGroupService],
    }).compile()

    controller = module.get<VideoGroupController>(VideoGroupController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
