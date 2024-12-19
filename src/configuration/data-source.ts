import { DataSource } from 'typeorm';
import { envConfig } from './env.config';
import * as path from 'path';

const rootDir = path.join(__dirname, '..', '..');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  synchronize: false,
  entities: [rootDir + '/src/**/*.entity{.ts,.js}'],
  migrations: [rootDir + '/src/migrations/*{.ts,.js}'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
