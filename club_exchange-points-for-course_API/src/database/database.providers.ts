import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI env variable not defined');
      }
      return mongoose.connect(process.env.MONGODB_URI);
    },
  },
];
