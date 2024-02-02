import { Model } from 'mongoose';
import CatalogProductsModel from '../model/catalog-products.model';
import { formatSellerIds } from '../common/helper';
import { ProductInfoServices } from './productInfo.service';
import { CATALOG_PRODUCTS_MODEL } from 'src/database/database.constants';
import { Inject } from '@nestjs/common';

export class GetProductsByClusterService {
  constructor(
    @Inject(CATALOG_PRODUCTS_MODEL)
    @Inject(ProductInfoServices)
    private readonly catalogProductsModel: Model<CatalogProductsModel>,
    private readonly productInfoServices: ProductInfoServices,
  ) {}

  async getProductsByCluster(
    sellerIds: string,
    productCluster: number,
  ): Promise<CatalogProductsModel[]> {
    const sellersFormatted = formatSellerIds(sellerIds);

    if (!sellersFormatted.length) {
      return [];
    }

    const query = {
      'productClusters.id': productCluster,
      quantity: { $gt: 0 },
      sellers: { $elemMatch: { $or: sellersFormatted } },
    };
    const products = await this.catalogProductsModel
      .find(query)
      .limit(20)
      .exec();

    return products;
  }
}
