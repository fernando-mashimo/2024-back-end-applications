import { Test, TestingModule } from '@nestjs/testing';
import { VtexController } from './vtex.controller';
import { VtexService } from './vtex.service';

describe('VtexController', () => {
  let controller: VtexController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VtexController],
      providers: [VtexService],
    }).compile();

    controller = module.get<VtexController>(VtexController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
