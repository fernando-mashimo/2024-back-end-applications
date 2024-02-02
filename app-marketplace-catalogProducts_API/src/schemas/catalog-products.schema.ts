import mongoose from 'mongoose';

const cashbackSchema = new mongoose.Schema({
  sellerId: String,
  value: Number,
}, { _id: false });

export const CatalogProductsSchema = new mongoose.Schema({
  skuId: {
    type: Number,
    index: true,
    unique: true,
  },
  name: String,
  productId: {
    type: Number,
    index: true,
  },
  brandId: Number,
  brand: String,
  listPrice: Number,
  listPriceFormatted: String,
  bestPrice: Number,
  bestPriceFormatted: String,
  installments: Number,
  installmentsValue: Number,
  installmentsInsterestRate: Number,
  cashback: [cashbackSchema],
  salesChannel: Number,
  departmentId: Number,
  description: String,
  isActive: Boolean,
  releaseDate: String,
  similars: [
    {
      productId: Number,
      productName: String,
    },
  ],
  measures: {
    cubicWeight: Number,
    height: Number,
    length: Number,
    weight: Number,
    width: Number,
  },
  categoryId: {
    type: String,
    index: true,
  },
  rating: {
    average: Number,
    totalCount: Number,
  },
  images: [
    {
      imageId: String,
      imageUrl: String,
      imageLabel: String,
      imageText: String,
      _id: false,
    },
  ],
  sellers: [
    {
      sellerId: String,
      sellerName: String,
      _id: false,
    },
  ],
  categoryTree: [
    {
      id: Number,
      name: String,
      _id: false,
    },
  ],
  skuname: String,
});
