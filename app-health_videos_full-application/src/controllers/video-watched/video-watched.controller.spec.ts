import { Test, TestingModule } from '@nestjs/testing';
import { VideoWatchedController } from './video-watched.controller';
import { VideoWatchedService } from './video-watched.service';

describe('VideoWatchedController', () => {
  let controller: VideoWatchedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoWatchedController],
      providers: [VideoWatchedService],
    }).compile();

    controller = module.get<VideoWatchedController>(VideoWatchedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
