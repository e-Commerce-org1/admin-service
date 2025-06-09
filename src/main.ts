// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();


// main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the regular HTTP application
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
  console.log(`Application is running on: HTTP 4000, gRPC 50051`);
}
bootstrap();