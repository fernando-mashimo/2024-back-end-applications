import * as mongoose from 'mongoose';
import { Status } from '../common/enums';

export interface CourseInfo {
  name: string;
  creatorName: string;
  thumbnail: string;
  length: number;
}

export const CourseOrderSchema = new mongoose.Schema({
  nutritionistId: String,
  fullName: String,
  status: { type: String, enum: Object.values(Status) },
  orderFormId: String,
  courseInfo: {
    name: String,
    creatorName: String,
    thumbnail: String,
    length: Number,
  },
  coursePriceBRL: Number,
  coursePricePoints: Number,
  paymentReceiptFile: String,
  courseURL: String,
  otherInfo: String,
  createdAt: Date,
  updatedAt: Date,
});
