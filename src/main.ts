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

  // // Create the gRPC microservice
  // const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.GRPC,
  //     options: {
  //       package: 'useradmin',
  //       protoPath: join(__dirname, 'user.proto'),
  //       url: '0.0.0.0:50051',
  //     },
  //   },
  // );

  // // Start both servers
  // await grpcApp.listen();
  await app.listen(3000);
  console.log(`Application is running on: HTTP 3000, gRPC 50051`);
}
bootstrap();