import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserAdminGrpcModule } from '../../grpc/usergrpc/grpc.module';
import { AdminModule } from 'src/modules/admin-auth/admin.module';
import { UserAdminGrpcService } from 'src/modules/users/grpc.service';


@Module({
  imports: [UserAdminGrpcModule,AdminModule],
  controllers: [UserController],
  providers: [UserAdminGrpcModule],
})
export class UserModule {}

