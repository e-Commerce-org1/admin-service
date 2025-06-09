import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import {winstonModule} from 'nest-winston';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  // const loggerProvider = createLoggerProvider('Main');
  // const winstonInstance = loggerProvider.useFactory();

  // // Create app with Winston as the logger
  // const app = await NestFactory.create(AppModule, {
  //   logger: WinstonModule.createLogger({
  //     instance: winstonInstance
  //   })
  // });

  const config = new DocumentBuilder()
    .setTitle('Admin Authentication API')
    .setDescription('API for Admin Authentication and Authorization')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
