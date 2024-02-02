import { Connection } from 'mongoose';
import {
  CATALOG_PRODUCTS_MODEL,
  CATALOG_PRODUCTS_SCHEMA,
  DATABASE_CONNECTION,
} from './database.constants';
import { CatalogProductsSchema } from 'src/schemas/catalog-products.schema';

export const generalProviders = [
  {
    provide: CATALOG_PRODUCTS_MODEL,
    useFactory: (connection: Connection) =>
      connection.model(CATALOG_PRODUCTS_SCHEMA, CatalogProductsSchema),
    inject: [DATABASE_CONNECTION],
  },
];
