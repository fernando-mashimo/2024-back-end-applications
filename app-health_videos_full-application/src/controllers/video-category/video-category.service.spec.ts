import { Test, TestingModule } from '@nestjs/testing';
import { VideoCategoryService } from './video-category.service';

describe('VideoCategoryService', () => {
  let service: VideoCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoCategoryService],
    }).compile();

    service = module.get<VideoCategoryService>(VideoCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
