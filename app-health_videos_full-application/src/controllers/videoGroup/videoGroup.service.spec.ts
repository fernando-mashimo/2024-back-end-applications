import { Test, TestingModule } from '@nestjs/testing';
import { VideoGroupService } from './videoGroup.service';

describe('VideoGroupService', () => {
  let service: VideoGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoGroupService],
    }).compile();

    service = module.get<VideoGroupService>(VideoGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
