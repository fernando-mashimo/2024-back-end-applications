import { CatalogProduct } from '../entities/catalog-product.entity';
import { CommonSku } from '../entities/sku.entity';

export const formatToCommonSku = (sku: CatalogProduct): CommonSku => {
  const imagesNotNull = sku.images.filter((image) => !!image);
  const images = [imagesNotNull[0]];

  const discount =
    sku.listPrice !== 0
      ? Math.round((1 - sku.bestPrice / sku.listPrice) * 100)
      : 0;
  const seller = {
    id: sku.sellers[0].sellerId,
    name: sku.sellers[0].sellerName,
  };
  return {
    id: sku.skuId,
    productId: sku.productId,
    hasNutriPrescription: false,
    name: sku.name,
    brandName: sku.brand,
    images,
    originalPrice: sku.listPrice,
    price: sku.bestPrice,
    quantity: 1,
    discount,
    variationType: 'N/A',
    productVariation: [],
    similarProducts: [],
    seller,
    description: sku.description,
  };
};
