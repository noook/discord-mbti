import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as entities from './entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: Object.values(entities),
  migrations: ['src/migration/*.ts'],
  subscribers: [],
});
