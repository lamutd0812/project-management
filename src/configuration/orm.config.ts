import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { envConfig } from './env.config';

const rootDir = path.join(__dirname, '..', '..');
console.log(rootDir);

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    __dirname + '/../**/**/**/*.entity.js',
    __dirname + '/../**/**/**/*.entity.ts',
  ],
  migrations: [rootDir + '/dist/migrations/**/*.js'],
  subscribers: [rootDir + '/dist/subscriber/**/*.js'],
  extra: {
    connectionLimit: 20,
  },
  cli: {
    entitiesDir: '**/*.entity{.ts,.js}',
    migrationsDir: ['src/migrations'],
    subscribersDir: 'subscriber',
  },
} as any;

export default ormConfig;
