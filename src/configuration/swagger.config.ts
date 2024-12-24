import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Project Management API Document')
  .setDescription('The API documentation for the project management')
  .setVersion('1.0')
  .addTag('API Docs')
  .addSecurity('basic', {
    type: 'http',
    scheme: 'basic',
    description: 'Key in username password crosspoding',
  })
  .addBearerAuth({
    description: 'Token after login',
    type: 'http',
    in: 'header',
    scheme: 'bearer',
  })
  .build();

export const customOptions: SwaggerCustomOptions = {
  customSiteTitle: 'Backend Project Base API Docs',
  swaggerOptions: {
    persistAuthorization: true,
    operationsSorter: 'method',
  },
};
