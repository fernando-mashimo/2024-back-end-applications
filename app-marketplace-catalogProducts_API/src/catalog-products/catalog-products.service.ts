import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CATALOG_PRODUCTS_MODEL } from 'src/database/database.constants';
import CatalogProductsModel from './model/catalog-products.model';
import { FindProductsQueryParamsDto } from './dto/find-products-query-params.dto';
import { formatSellerIds } from './common/helper';
import { CategoryTree, CatalogProductWithVariation, Sort, productIdAndSkuId } from './entities/catalog-product.entity';
import { ProductInfoServices } from './external-services/productInfo.service';
import { StockSku } from './entities/sku.entity';
import { BestSellingService } from './external-services/best-selling.service';
import { GetProductsByClusterService } from './external-services/get-products-by-cluster.service';
import { getSkuData } from './external-services/vtex-api';
import pino from 'pino';
@Injectable()
export class CatalogProductsService {
  private readonly logger = pino();

  constructor(
    @Inject(CATALOG_PRODUCTS_MODEL)
    private readonly catalogProductsModel: Model<CatalogProductsModel>,
    private readonly productInfoServices: ProductInfoServices,
    private readonly bestSellingService: BestSellingService,
    private readonly getProductsByClusterService: GetProductsByClusterService,
  ) {}

  async findAll(page: number, limit: number): Promise<CatalogProductsModel[]> {
    try {
      const skip = (page - 1) * limit;

      const products = await this.catalogProductsModel
        .find({})
        .skip(skip)
        .limit(limit)
        .exec();
      !products.length
        ? this.logger.warn(`No products found`)
        : this.logger.info(
            `Products successfully listed: ${products.length} items`,
          );
      return products;
    } catch (error) {
      this.logger.error('Error listing products', `Error: ${error.message}`);
      throw new BadRequestException(error);
    }
  }

  async listProducts(filters: string): Promise<CatalogProductsModel[]> {
    try {
      const {
        page,
        limit,
        brandId,
        categoryId,
        sellers,
        orderByName,
        orderByPrice,
        search,
      }: FindProductsQueryParamsDto = JSON.parse(decodeURIComponent(filters));

      const query: any = { $and: [] };
      query.$and.push({ quantity: { $gt: 0 } });

      if (brandId) query.$and.push({ brandId: brandId });

      if (search) query.$and.push({ $text: { $search: search } });

      if (categoryId)
        query.$and.push({
          categoryTree: { $elemMatch: { id: Number(categoryId) } },
        });

      if (sellers?.length) {
        const sellersFormated = sellers.map((seller) => {
          return { sellerId: seller };
        });
        query.$and.push({ sellers: { $elemMatch: { $or: sellersFormated } } });
      }
      const order: any = {} as Sort;
      if (orderByName) order.name = orderByName === 'asc' ? 'asc' : 'desc';
      if (orderByPrice)
        order.bestPrice = orderByPrice === 'asc' ? 'asc' : 'desc';

      const skip = (page - 1) * limit;

      const products = await this.catalogProductsModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort(order)
        .exec();
      !products.length
        ? this.logger.warn(`No products found`)
        : this.logger.info(
            `Products successfully listed: ${products.length} items`,
          );
      products.forEach((product) => {
        // filtra apenas imagens e sellers !== null
        product.images = product.images.filter((image) => !!image);
        product.sellers = product.sellers.filter((seller) => !!seller);
      });
      return products;
    } catch (error) {
      this.logger.error('Error listing products', `Error: ${error.message}`);
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number): Promise<CatalogProductsModel> {
    try {
      const product = await this.catalogProductsModel.findOne({ skuId: id });
      !product
        ? this.logger.warn(`Not found product with id: ${id}`)
        : this.logger.info(`Product successfully found with id: ${id}`);
      product.images = product.images.filter((image) => !!image);
      product.sellers = product.sellers.filter((seller) => !!seller);
      return product;
    } catch (error) {
      this.logger.error(
        `Error finding product with id: ${id}`,
        `Error: ${error.message}`,
      );
      throw new BadRequestException(error);
    }
  }

  async find(query: object): Promise<CatalogProductsModel[]> {
    try {
      const products = await this.catalogProductsModel.find(query).exec();
      !products || !products.length
        ? this.logger.warn(`No products found`)
        : this.logger.info(
            `Products successfully found: ${products.length} items`,
          );
      products.forEach((product) => {
        // filtra apenas imagens e sellers !== null
        product.images = product.images.filter((image) => !!image);
        product.sellers = product.sellers.filter((seller) => !!seller);
      });
      return products;
    } catch (error) {
      this.logger.error(`Error finding products`, `Error: ${error.message}`);
      throw new BadRequestException(error);
    }
  }

  async getProductsByProductIdsAndSku(
    skuIdAndProductId: string,
  ): Promise<CatalogProductWithVariation[]> {
    const ids: productIdAndSkuId[] = JSON.parse(
      decodeURIComponent(skuIdAndProductId),
    );
    try {
      const result = await Promise.all(
        ids.map(async (id) => {
          const products = await this.catalogProductsModel
            .find({ productId: Number(id.productId), quantity: { $gt: 0 } })
            .lean()
            .exec();
          const productFiltered = products.find(
            (product) => product.skuId.toString() === id.sku.toString(),
          );
          if (!productFiltered) {
            return null;
          }
          const variationTypes: any = await getSkuData(productFiltered.productId);
          return {
            ...productFiltered,
            variationTypes: variationTypes?.dimensions || ['Variações'],
            similars: await Promise.all(productFiltered?.similars.map(async(similar) => {
              const productSimilars = await this.catalogProductsModel.findOne({productId: similar.productId })
              return {
                productId: similar.productId,
                images: productSimilars.images,
                name: similar.productName,
                listPrice: productSimilars.listPrice,
                bestPrice: productSimilars.bestPrice,
                cashback: productSimilars.cashback,
                sellerId: productSimilars.sellers[0].sellerId,
                sellerName: productSimilars.sellers[0].sellerName,
                skuId: productSimilars.skuId
              }
            })),
            productVariations: products
              .map((product) => {
                if (productFiltered.skuId !== product.skuId) {
                  const sellersFiltered = product.sellers
                    ? product.sellers.filter((element) => element !== null)
                    : [];
                  return {
                    skuId: product.skuId,
                    name: product.skuname,
                    bestPrice: product.bestPrice,
                    listPrice: product.listPrice,
                    images: product.images,
                    variationType: Object.keys(variationTypes?.skus.find(variation => variation.sku === product.skuId).dimensions).length ? variationTypes?.skus.find(variation => variation.sku === product.skuId).dimensions : {'Outros': product.skuname.split(' ')[0]},
                    sellerId:
                      sellersFiltered.length > 0
                        ? sellersFiltered[0].sellerId
                        : 'No seller ID available',
                    sellerName:
                      sellersFiltered.length > 0
                        ? sellersFiltered[0].sellerName
                        : 'No seller name available',
                    cashback: product.cashback,
                  };
                }
                return null;
              })
              .filter(Boolean),
          };
        }),
      );

      !result.length || !result[0]
        ? this.logger.warn(`No products found with given Product and SKU Ids`)
        : this.logger.info(
            `Products successfully found with given Product and SKU Ids: ${result.length} items`,
          );

      if (result[0].brand === 'Integralmédica') {
        const existOthers = result[0].productVariations.some(item => 'Outros' in item.variationType)
        
        if (existOthers) {
          result[0].variationTypes.push('Outros')
          return result
        }
      }
      return result;
    } catch (error) {
      this.logger.error(
        `Error: ${error.message}`,
      );
      throw new BadRequestException(error);
    }
  }

  async searchProductsByTerm(
    searchTerms: string,
    sellerIds: string,
  ): Promise<CatalogProductsModel[]> {
    try {
      const sellersFormatted = formatSellerIds(sellerIds);
      const query = decodeURIComponent(searchTerms).replace(/ /g, '""');

      if (sellersFormatted.length) {
        const products = await this.catalogProductsModel
          .find({
            $and: [
              { $text: { $search: query } },
              { quantity: { $gt: 0 } },
              { sellers: { $elemMatch: { $or: sellersFormatted } } },
            ],
          })
          .exec();
        !products.length
          ? this.logger.warn(`No products found with given search terms`)
          : this.logger.info(
              `Products successfully found with given search terms: ${products.length} items`,
            );
        products.forEach((product) => {
          // filtra apenas imagens e sellers !== null
          product.images = product.images.filter((image) => !!image);
          product.sellers = product.sellers.filter((seller) => !!seller);
        });
        return products;
      }
      return [];
    } catch (error) {
      this.logger.error(
        `Error finding products with given search terms`,
        `Error: ${error.message}`,
      );
      throw new BadRequestException(error);
    }
  }

  async getSkuStock(id: string): Promise<StockSku> {
    try {
      const skuStockInfo = await this.productInfoServices.getStockInfo(+id);
      this.logger.info('Sku stock successfully found');
      return skuStockInfo;
    } catch (error) {
      this.logger.error('Error finding sku stock', `Error: ${error.message}`);
      throw new BadRequestException(error);
    }
  }

  async getProductsByPrescription(
    name: string,
  ): Promise<CatalogProductsModel[]> {
    try {
      const productsFormated: string[] = JSON.parse(decodeURIComponent(name));
      const promises = productsFormated.map(async (product) => {
        const query = JSON.stringify(product).replace(/ /g, '""');
        return this.catalogProductsModel.find(
          {
            $and: [{ $text: { $search: query } }, { quantity: { $gt: 0 } }],
          },
          { skuId: 1 },
        );
      });
      const result = await Promise.all(promises);

      !result.flat().length
        ? this.logger.warn(`No products found with given prescription`)
        : this.logger.info(
            `Products successfully found with given prescription: ${
              result.flat().length
            } items`,
          );
      return result.flat();
    } catch (error) {
      this.logger.error(
        `Error finding products with given prescription`,
        `Error: ${error.message}`,
      );
      throw new BadRequestException(error);
    }
  }

  async getBestSelling(sellerIds: string): Promise<CatalogProductsModel[]> {
    try {
      const bestSelling =
        await this.bestSellingService.getBestSellingProductsByMonth();
      const skuIds = bestSelling.map((selling) => selling.skuId);
      const sellersFormated = formatSellerIds(sellerIds);
      if (sellersFormated.length) {
        const bestsellingProducts = await this.catalogProductsModel
          .find(
            {
              skuId: { $in: skuIds },
              quantity: { $gt: 0 },
              sellers: { $elemMatch: { $or: sellersFormated } },
            }
          )
          .exec();

        if (bestsellingProducts.length) {
          !bestSelling.length
            ? this.logger.warn(`No best selling products found`)
            : this.logger.info(
                `Best selling products successfully found: ${bestSelling.length} items`,
              );
          return bestsellingProducts;
        }
        // Se não for encontrado nenhum sku como "best selling", retorna todos os produtos ordenados por preço ASC
        const allProducts = await this.catalogProductsModel
          .find(
            {
              sellers: { $elemMatch: { $or: sellersFormated } },
              quantity: { $gt: 0 },
            }
          )
          .limit(20)
          .exec();
        !allProducts.length
          ? this.logger.warn(`No best selling or any products found at all`)
          : this.logger.info(
              `No best selling products found. Returning all products: ${allProducts.length} items`,
            );
        return allProducts
      }
      // Se o CEP não for atendido por nenhum seller, retorna um array vazio
      return [];
    } catch (error) {
      this.logger.error(
        `Error finding best selling products`,
        `Error: ${error.message}`,
      );
      throw new BadRequestException(error);
    }
    // Retorna os produtos mais vendidos ordenados por preço ASC
  }

  async getBuyAlso(sellerIds: string): Promise<CatalogProductsModel[]> {
    try {
      const buyAlsoClusterId = 156;

      const products =
        await this.getProductsByClusterService.getProductsByCluster(
          sellerIds,
          buyAlsoClusterId,
        );
      !products.length
        ? this.logger.warn(`No "Buy Also" clustered products found`)
        : this.logger.info(
            `"Buy Also" clustered products successfully found: ${products.length} items`,
          );
      return products;
    } catch (error) {
      this.logger.error(
        `Error finding "Buy Also" clustered products`,
        `Error: ${error.message}`,
      );
      throw new BadRequestException(error);
    }
  }

  async getLastReleases(sellerIds: string): Promise<CatalogProductsModel[]> {
    try {
      const lastReleasesClusterId = 157;

      const products = await this.getProductsByClusterService.getProductsByCluster(
          sellerIds,
          lastReleasesClusterId,
        );
      !products.length
        ? this.logger.warn(`No "Last Releases" clustered products found`)
        : this.logger.info(
            `"Last Releases" clustered products successfully found: ${products.length} items`,
          );
      return products;
    } catch (error) {
      this.logger.error(
        `Error finding "Last Releases" clustered products`,
        `Error: ${error.message}`,
      );
      throw new BadRequestException(error);
    }
  }

  async getCategoriesBySellerId(sellerId: string): Promise<CategoryTree[]> {
    try {
      const query = {
        "sellers": {
          $elemMatch: {
            "sellerId": sellerId
          }
        }
      }
      const products = await this.catalogProductsModel.find(query, {categoryTree: 1}).exec();
      if (!products) return []
      const categories = []
      for (const product of products) {
        for (const category of product.categoryTree) {
          if (!categories.some(categoryExist => categoryExist.id === category.id)) {
            categories.push(category)
          }
        }
      }
      return categories
    } catch (error) {
      this.logger.error(`Error finding products`, `Error: ${error.message}`);
      throw new BadRequestException(error);
    }
  }
}
