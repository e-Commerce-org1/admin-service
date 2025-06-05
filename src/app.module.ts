// import { Module } from '@nestjs/common';
// import { AdminModule } from './admin/admin.module';


// @Module({
//   imports: [AdminModule],
//   controllers: [],
//   providers: [],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from'./admin-auth/admin.module';
import { RedisService } from './redis/redis.service'; 
 import { AuthGrpcClientModule } from './admin-auth/grpc/authgrpc/auth.module';
import { ConfigModule } from '@nestjs/config';
// import { ProductModule } from './admin-product/product.module';
// import { ProductGrpcClientModule } from './admin-product/productgrpc/productgrpc.module';
//  import { ProductGrpcClientModule } from './admin-product/productgrpc/productgrpc.module';
//  import { ProductModule } from './admin-product/product.module';
// import { ProductModule } from './admin-product/product.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env']
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AdminModule
  ],

  providers: [AuthGrpcClientModule],
})
export class AppModule {}
