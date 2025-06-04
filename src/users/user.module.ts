import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserAdminGrpcModule } from './grpc/grpc.module';


@Module({
  imports: [UserAdminGrpcModule],
  controllers: [UserController],
  providers: [UserAdminGrpcModule],
})
export class UserModule {}

