import { Test, TestingModule } from '@nestjs/testing';
import { VtexNotificationController } from './vtex-notification.controller';

describe('VtexNotificationController', () => {
  let controller: VtexNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VtexNotificationController],
    }).compile();

    controller = module.get<VtexNotificationController>(VtexNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
