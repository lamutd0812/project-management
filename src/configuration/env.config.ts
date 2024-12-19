/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as config from 'config';
import * as dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
  // @ts-expect-error
  NODE_ENV: config.get<string>('node_env') | 'development',
  PORT: config.get<number>('server.port') | 3000,
  BASE_URL: config.get<string>('service.baseUrl'),
  SWARGGER_BASE_URL: config.get<string>('service.docsBaseUrl'),
  APP_VERSION: config.get<string>('service.apiVersion'),
  BASE_API: config.get<string>('service.baseApi'),

  // database
  DB_HOST: config.get<string>('db.host'),
  DB_PORT: config.get<number>('db.port'),
  DB_USERNAME: config.get<string>('db.username'),
  DB_PASSWORD: config.get<string>('db.password'),
  DB_NAME: config.get<string>('db.name'),

  // jwt
  JWT_SECRET_KEY: config.get<string>('jwt.secret'),
  JWT_EXPIRES_IN: config.get<string>('jwt.expTime'),

  // admin
  ADMIN_USERNAME: config.get<string>('admin.username'),
  ADMIN_PASSWORD: config.get<string>('admin.password'),
};
