import { Module } from '@nestjs/common';
import { CatalogProductsService } from './catalog-products.service';
import { CatalogProductsController } from './catalog-products.controller';
import { DatabaseModule } from 'src/database/database.module';
import { generalProviders } from 'src/database/general.provider';
import { ProductInfoServices } from './external-services/productInfo.service';
import { BestSellingService } from './external-services/best-selling.service';
import { GetProductsByClusterService } from './external-services/get-products-by-cluster.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CatalogProductsController],
  providers: [
    CatalogProductsService,
    ...generalProviders,
    ProductInfoServices,
    BestSellingService,
    GetProductsByClusterService,
  ],
})
export class CatalogProductsModule {}
