import { Connection } from 'mongoose';
import {
  APP_SUBSCRIPTION_ORDERS_MODEL,
  APP_SUBSCRIPTION_ORDERS_SCHEMA,
  DATABASE_CONNECTION,
} from './database.constants';
import { AppSubscriptionOrderSchema } from '../app-subscription-orders/schema/app-subscription-order.schema';

export const generalProviders = [
  {
    provide: APP_SUBSCRIPTION_ORDERS_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(
        APP_SUBSCRIPTION_ORDERS_SCHEMA,
        AppSubscriptionOrderSchema,
      ),
    inject: [DATABASE_CONNECTION],
  },
];
