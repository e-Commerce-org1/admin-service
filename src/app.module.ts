
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from'./admin-auth/admin.module';
import { RedisService } from './redis/redis.service'; 
 import { AuthGrpcClientModule } from './admin-auth/grpc/authgrpc/auth.module';
import { ConfigModule } from '@nestjs/config';


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
