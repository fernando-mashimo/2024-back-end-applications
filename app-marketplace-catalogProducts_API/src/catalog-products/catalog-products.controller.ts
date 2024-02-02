import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogProductsService } from './catalog-products.service';
import CatalogProductsModel from './model/catalog-products.model';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { CatalogProduct, CatalogProductWithVariation, CategoryTree } from './entities/catalog-product.entity';
import { StockSku } from './entities/sku.entity';
import pino from 'pino';

@Controller('catalog-products')
export class CatalogProductsController {
  private readonly logger = pino();
  constructor(
    private readonly catalogProductsService: CatalogProductsService,
  ) {}

  @ApiOkResponse({
    description: 'List products.',
    type: CatalogProduct,
    isArray: true,
  })
  @Get('filter')
  listProducts(
    @Query('filters') filters: string,
  ): Promise<CatalogProductsModel[]> {
    this.logger.info('Retrieving list of products');
    return this.catalogProductsService.listProducts(filters);
  }

  @ApiOkResponse({
    description: 'List products.',
    type: CatalogProduct,
    isArray: true,
  })
  @Get('find-all')
  @ApiQuery({ name: 'page', type: String, description: 'Page number' })
  @ApiQuery({
    name: 'limit',
    type: String,
    description: 'Number of items per page',
  })
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<CatalogProductsModel[]> {
    this.logger.info('Retrieving list of products');
    return this.catalogProductsService.findAll(Number(page), Number(limit));
  }

  @ApiOkResponse({
    description: 'Get product by sku',
    type: CatalogProduct,
  })
  @Get('sku/:id')
  getBySku(@Param('id') id: string): Promise<CatalogProductsModel> {
    this.logger.info(`Retrieving product with skuId: ${id}`);
    return this.catalogProductsService.findOne(+id);
  }

  @ApiOkResponse({
    description: 'Get product by productId and skuId',
    type: CatalogProduct,
    isArray: true,
  })
  @Get('sku-product-id/:skuIdAndPoruductId')
  getProducstByProductIdsAndSku(
    @Param('skuIdAndPoruductId') skuIdAndPoruductId: string,
  ): Promise<CatalogProductWithVariation[]> {
    this.logger.info('Retrieving product with given product and sku id');
    return this.catalogProductsService.getProductsByProductIdsAndSku(
      skuIdAndPoruductId,
    );
  }

  @ApiOkResponse({
    description: 'Get product By productId',
    type: CatalogProduct,
  })
  @Get('product-id/:id')
  async getByProductId(
    @Param('id') id: string,
  ): Promise<CatalogProductsModel[]> {
    this.logger.info(`Retrieving product with productId: ${id}`);
    return this.catalogProductsService.find({ productId: id });
  }

  @ApiOkResponse({
    description: 'Search products by term and sellerIds.',
    type: CatalogProduct,
    isArray: true,
  })
  @Get('search/:searchTerm/:sellerIds')
  async searchProductsByTerm(
    @Param('searchTerm') searchTerm: string,
    @Param('sellerIds') sellerIds: string,
  ): Promise<CatalogProductsModel[]> {
    this.logger.info(
      `Retrieving products with given search terms: ${searchTerm}`,
    );
    return this.catalogProductsService.searchProductsByTerm(
      searchTerm,
      sellerIds,
    );
  }

  @ApiOkResponse({
    description: 'Get stocked quantity of SKU.',
    type: StockSku,
  })
  @Get('sku/getSkuStock/:id')
  async getSkuStock(@Param('id') id: string): Promise<StockSku> {
    this.logger.info(`Retrieving stock for skuId: ${id}`);
    return this.catalogProductsService.getSkuStock(id);
  }

  @ApiOkResponse({
    description: 'Get product By prescription',
    type: CatalogProduct,
    isArray: true,
  })
  @Get('prescription/:prescription')
  async getByPrescription(
    @Param('prescription') prescription: string,
  ): Promise<CatalogProductsModel[]> {
    this.logger.info('Retrieving products for prescription');
    return this.catalogProductsService.getProductsByPrescription(prescription);
  }

  @ApiOkResponse({
    description: 'Get BestSelling',
    type: CatalogProduct,
    isArray: true,
  })
  @Get('best-selling/:sellerIds')
  async getBestSelling(
    @Param('sellerIds') sellerIds: string,
  ): Promise<CatalogProductsModel[]> {
    this.logger.info('Retrieving "Best Selling" products');
    return this.catalogProductsService.getBestSelling(sellerIds);
  }

  @ApiOkResponse({
    description: 'List "Buy Also" products',
    type: CatalogProduct,
    isArray: true,
  })
  @Get('buy-also/:sellerIds')
  async getBuyAlso(
    @Param('sellerIds') sellerIds: string,
  ): Promise<CatalogProductsModel[]> {
    this.logger.info('Retrieving "Buy Also" products');
    return this.catalogProductsService.getBuyAlso(sellerIds);
  }

  @ApiOkResponse({
    description: 'Get last releases',
    type: CatalogProduct,
    isArray: true,
  })
  @Get('last-releases/:sellerIds')
  async getLastReleases(
    @Param('sellerIds') sellerIds: string,
  ): Promise<CatalogProductsModel[]> {
    this.logger.info('Retrieving "Last Releases" products');
    return this.catalogProductsService.getLastReleases(sellerIds);
  }

  @ApiOkResponse({
    description: 'List seller products',
    type: CatalogProduct,
    isArray: true,
  })
  @Get('seller')
  async getProductsBySeller(
    @Query('filters') filters: string,
  ): Promise<CatalogProductsModel[]> {
    this.logger.info('Retrieving products by seller');
    return this.catalogProductsService.listProducts(filters);
  }

  @ApiOkResponse({
    description: 'Get categories by seller',
    type: CategoryTree,
    isArray: true,
  })
  @Get('categories/:sellerId')
  async getCategoriesBySellerId(
    @Param('sellerId') sellerId: string,
  ): Promise<CategoryTree[]> {
    this.logger.info('Retrieving products by seller');
    return this.catalogProductsService.getCategoriesBySellerId(sellerId);
  }
}
