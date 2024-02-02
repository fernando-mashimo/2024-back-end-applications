import * as mongoose from 'mongoose';
import { Status, Origin } from '../common/enums';

export const AppSubscriptionOrderSchema = new mongoose.Schema({
  nutritionistId: String,
  fullName: String,
  status: { type: String, enum: Object.values(Status) },
  origin: { type: String, enum: Object.values(Origin) },
  orderFormId: String,
  subscriptionPriceBRL: Number,
  subscriptionPricePoints: Number,
  paymentReceiptFile: String,
  coupon: String,
  createdAt: Date,
  updatedAt: Date,
});
