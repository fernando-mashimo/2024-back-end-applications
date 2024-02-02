import { MeasureValues } from "aws-sdk/clients/timestreamwrite";

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

export class CategoryTree {
  id: number;
  name: string;
}

export class Sort {
  name?: string;
  bestPrice?: string;
}

export class CatalogProduct {
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
  cashback: number;
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
  productName?: string;
}

export class productIdAndSkuId {
  productId: string;
  sku: string;
}

class Cashback {
  sellerId: string;
  value: number;
}

class ProductVariations {
  skuId: number;
  name: string;
  bestPrice: number;
  listPrice: number;
  images: Images[];
  sellerId: string;
  sellerName: string;
  cashback: Cashback[];
}

export class CatalogProductWithVariation {
  skuId: number;
  bestPrice: number;
  brand: string;
  brandId: number;
  cashback: Cashback[];
  categoryId: string;
  categoryTree: { id: number; name: string }[];
  description: string;
  images: Images[];
  installments: number;
  installmentsInsterestRate: number;
  installmentsValue: number;
  listPrice: number;
  name: string;
  productId: number;
  releaseDate: string;
  salesChannel: number;
  sellers: Seller[];
  similars: ProductVariations[];
  quantity: number;
  skuname: string;
  productVariations: ProductVariations[];
}
