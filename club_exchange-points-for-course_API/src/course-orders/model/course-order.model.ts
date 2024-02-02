import { Document } from 'mongoose';
import { Status } from '../common/enums';
import { CourseInfo } from '../schema/course-order.schema';

export default class CourseOrderModel extends Document {
  _id: string;
  nutritionistId: string;
  fullName: string;
  status: Status;
  orderFormId: string;
  courseInfo: CourseInfo;
  coursePriceBRL: number;
  coursePricePoints: number;
  paymentReceiptFile: string;
  courseURL: string;
  otherInfo: string;
  createdAt: Date;
  updatedAt: Date;
}
