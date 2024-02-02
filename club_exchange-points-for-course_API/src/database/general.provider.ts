import { Connection } from 'mongoose';
import {
  COURSE_ORDERS_MODEL,
  COURSE_ORDERS_SCHEMA,
  DATABASE_CONNECTION,
} from './database.constants';
import { CourseOrderSchema } from '../course-orders/schema/course-order.schema';

export const generalProviders = [
  {
    provide: COURSE_ORDERS_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(COURSE_ORDERS_SCHEMA, CourseOrderSchema),
    inject: [DATABASE_CONNECTION],
  },
];
