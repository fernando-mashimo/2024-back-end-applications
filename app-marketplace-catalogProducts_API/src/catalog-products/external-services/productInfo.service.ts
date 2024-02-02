import { StockSku } from '../entities/sku.entity';
import { BadRequestException, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import CatalogProductsModel from '../model/catalog-products.model';
import { CATALOG_PRODUCTS_MODEL } from 'src/database/database.constants';

export class ProductInfoServices {
  constructor(
    @Inject(CATALOG_PRODUCTS_MODEL)
    private readonly catalogProductsModel: Model<CatalogProductsModel>,
  ) {}
  async getStockInfo(skuId: number): Promise<StockSku> {
    try {
      const product = await this.catalogProductsModel
        .findOne({ skuId }, { quantity: 1 })
        .exec();

      if (!product)
        return {
          skuId: skuId.toString(),
          quantity: 0,
        };

      const { quantity } = JSON.parse(JSON.stringify(product));
      return {
        skuId: skuId.toString(),
        quantity,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
