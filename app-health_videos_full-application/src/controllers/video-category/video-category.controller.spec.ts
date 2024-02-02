import { Test, TestingModule } from '@nestjs/testing';
import { VideoCategoryController } from './video-category.controller';
import { VideoCategoryService } from './video-category.service';

describe('VideoCategoryController', () => {
  let controller: VideoCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoCategoryController],
      providers: [VideoCategoryService],
    }).compile();

    controller = module.get<VideoCategoryController>(VideoCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
