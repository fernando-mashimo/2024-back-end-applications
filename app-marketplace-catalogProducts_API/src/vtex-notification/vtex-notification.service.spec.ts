import { Test, TestingModule } from '@nestjs/testing';
import { VtexNotificationService } from './vtex-notification.service';

describe('VtexNotificationService', () => {
  let service: VtexNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VtexNotificationService],
    }).compile();

    service = module.get<VtexNotificationService>(VtexNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
