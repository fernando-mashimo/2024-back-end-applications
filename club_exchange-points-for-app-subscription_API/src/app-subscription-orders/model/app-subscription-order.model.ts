import { Document } from 'mongoose';
import { Status, Origin } from '../common/enums';

export default class AppSubscriptionOrderModel extends Document {
  _id: string;
  nutritionistId: string;
  fullName: string;
  status: Status;
  origin: Origin;
  orderFormId: string;
  subscriptionPriceBRL: number;
  subscriptionPricePoints: number;
  paymentReceiptFile: string;
  coupon: string;
  createdAt: Date;
  updatedAt: Date;
}
