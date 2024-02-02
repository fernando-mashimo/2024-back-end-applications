import { Document } from 'mongoose';

interface SimilarProduct {
  productId: number;
  productName: string;
}

interface Measure {
  cubicWeight: number;
  height: number;
  length: number;
  weight: number;
  width: number;
}

interface Images {
  imageId: string;
  imageUrl: string;
  imageLabel: string;
  imageText: string;
}

interface Seller {
  sellerId: string;
  sellerName: string;
}

interface CategoryTree {
  id: number;
  name: string;
}
class Cashback {
  sellerId: string;
  value: number;
}

export default class CatalogProductsModel extends Document {
  _id: string;
  skuId: number;
  name: string;
  productId: number;
  brandId: number;
  brand: string;
  listPrice: number;
  listPriceFormatted: string;
  bestPrice: number;
  bestPriceFormatted: string;
  installments: number;
  installmentsValue: number;
  installmentsInsterestRate: number;
  cashback: Cashback[];
  salesChannel: number;
  departmentId: number;
  description: string;
  isActive: boolean;
  releaseDate: string;
  similars: SimilarProduct[];
  measures: Measure;
  categoryId: string;
  rating: {
    average: number;
    totalCount: number;
  };
  images: Images[];
  sellers: Seller[];
  categoryTree: CategoryTree[];
  quantity: number;
  skuname: string;
}
