import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
// import { createLoggerProvider } from '../utils/logger/logger.provider';
import { ProductGrpcClientModule } from './productgrpc/productgrpc.module';
// import { ProductGrpcClientModule } from '../productgrpc/product.grpc-client';

@Module({
  imports: [
  ProductGrpcClientModule
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    // createLoggerProvider('ProductService'),
  ],
})
export class ProductModule {}
