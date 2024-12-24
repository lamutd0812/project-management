import { CONFIG } from '@configuration/config.provider';
import { envConfig } from '@configuration/env.config';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { IConfig } from 'config';
import * as path from 'path';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { AppModule } from './app.module';
import * as i18n from 'i18n';
import { customOptions, swaggerConfig } from '@configuration/swagger.config';
import { AllExceptionsFilter } from './filters';
import { UsersService } from './modules/users/users.service';

async function initializeApp(app: INestApplication) {
  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'device'],
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH',
  });

  app.setGlobalPrefix(envConfig.BASE_URL);
  app.useGlobalFilters(new AllExceptionsFilter());
  // Interceptors
  // app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());
}

async function initializeSwagger(app: INestApplication) {
  // Swagger
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    envConfig.SWARGGER_BASE_URL,
    app,
    swaggerDocument,
    customOptions,
  );
}

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  const appOptions = {
    cors: true,
    bufferLogs: true,
  };

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    appOptions,
  );

  const usersService = app.get<UsersService>(UsersService);

  app.get<IConfig>(CONFIG);

  await initializeApp(app);

  initializeSwagger(app);
  i18n.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: path.join(__dirname, '../i18n'),
    updateFiles: false,
  });
  /**
   *   Logger
   *   app.useLogger(app.get(Logger));
   */

  await app.listen(envConfig.PORT);
  try {
    // do something
    await usersService.generateAdmin();
  } catch (error) {
    console.error(`Failed to initialize, due to ${error}`);
    process.exit(1);
  }
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
