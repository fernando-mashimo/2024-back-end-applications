import { Test, TestingModule } from '@nestjs/testing';
import { CatalogProductsController } from './catalog-products.controller';
import { CatalogProductsService } from './catalog-products.service';

describe('CatalogProductsController', () => {
  let controller: CatalogProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogProductsController],
      providers: [CatalogProductsService],
    }).compile();

    controller = module.get<CatalogProductsController>(
      CatalogProductsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
