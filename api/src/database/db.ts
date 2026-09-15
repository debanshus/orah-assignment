import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  synchronize: process.env.NODE_ENV !== 'production', // auto-create schema in dev only
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/entities/**/*.{ts,js}'],
  migrations: [__dirname + '/migrations/**/*.{ts,js}'],
  subscribers: [],
});

/**
 * Initialise the database connection.
 * Call this lazily (e.g. inside the first request handler that needs the DB)
 * rather than at cold-start so Lambda containers stay light when no DB is needed.
 */
export async function initDataSource(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}

