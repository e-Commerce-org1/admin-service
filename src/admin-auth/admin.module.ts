import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { RedisModule } from '../redis/redis.module';
import config from '../config/jwt.config';
import { AuthGrpcClientModule } from './grpc/authgrpc/auth.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: config().jwtSecret,
        signOptions: { expiresIn: config().jwtExpiresIn }
      })
    }),
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ 
      name: Admin.name, 
      schema: AdminSchema 
    }]),
    AuthGrpcClientModule,
    RedisModule 
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    JwtStrategy 
  ],
  exports: [AdminService]
})
export class AdminModule {}