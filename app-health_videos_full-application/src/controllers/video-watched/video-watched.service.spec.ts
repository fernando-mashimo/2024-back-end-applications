import { Test, TestingModule } from '@nestjs/testing';
import { VideoWatchedService } from './video-watched.service';

describe('VideoWatchedService', () => {
  let service: VideoWatchedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoWatchedService],
    }).compile();

    service = module.get<VideoWatchedService>(VideoWatchedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
