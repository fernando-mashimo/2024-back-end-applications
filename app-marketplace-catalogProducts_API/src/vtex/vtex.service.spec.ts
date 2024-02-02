import { Test, TestingModule } from '@nestjs/testing';
import { VtexService } from './vtex.service';

describe('VtexService', () => {
  let service: VtexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VtexService],
    }).compile();

    service = module.get<VtexService>(VtexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
