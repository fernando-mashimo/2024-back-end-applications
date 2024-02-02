import { Test, TestingModule } from '@nestjs/testing';
import { VideoSubgroupService } from './videoSubgroup.service';

describe('VideoSubgroupService', () => {
  let service: VideoSubgroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoSubgroupService],
    }).compile();

    service = module.get<VideoSubgroupService>(VideoSubgroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
