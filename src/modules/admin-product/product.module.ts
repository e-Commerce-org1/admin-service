import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
// import { createLoggerProvider } from '../utils/logger/logger.provider';
import { ProductGrpcClientModule } from '../../grpc/productgrpc/productgrpc.module'
import { AuthGrpcClientModule } from 'src/grpc/authgrpc/auth.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminModule } from '../admin-auth/admin.module';

// import { RedisModule } from 'src/redis/redis.module';
//  import { AuthGuard } from 'src/rbac/guards/auth.guard';
//  import { ProductGrpcClientModule } from '../productgrpc/product.grpc-client';

@Module({
  imports: [
  ProductGrpcClientModule,AuthGrpcClientModule,AdminModule
  ],
  controllers: [ProductController],
  providers: [
    ProductService
    // createLoggerProvider('ProductService'),
  ],
})
export class ProductModule {}
