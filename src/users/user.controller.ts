// import { Controller, Delete, Get, Param, Put } from "@nestjs/common";
// import { UserService } from "./user.service";
// import { IUserAdminGrpcService } from "./grpc/user.interface";
// import { GrpcMethod } from "@nestjs/microservices";

// @Controller('user')
// export class userController{
    
//     constructor(private readonly UserService:UserService, private readonly userAdminService: IUserAdminGrpcService) {}

//     @Get('/view/:id')
//     async getUser(@Param('id') email){
//         return await this.UserService.findbyUser(email);
//     }

//     @Get('/view')
//     async getAll(){
//         return await this.UserService.findAll();
//     }
//     @Put('/block/:id')
//     async blockUser(@Param('id') id){
//         return await this.UserService.blockedUser(id)
//     }

//     @Put('/unblock/:id')
//     async unblockUser(@Param('id') id){
//         return await this.UserService.unBlockedUser(id)        
//     }
// }


import { Controller, Get, Param, Put, Query} from '@nestjs/common';

import { IUserAdminGrpcService } from './grpc/user.interface';
import { UserAdminGrpcService } from './grpc/grpc.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userAdminService: UserAdminGrpcService
  ) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userAdminService.getUserById({ userId: id });
  }

  @Get()
  async getAllUsers(@Query('page') page: number, @Query('limit') limit: number) {
    return this.userAdminService.getAllUsers({ page: page, limit: limit });
  }

  @Put('block/:id')
  async blockUser(@Param('id') id: string) {
    return this.userAdminService.updateUserStatus({
      userId: id,
      status: 'BLOCKED',
      reason: 'blocked'
    });
  }

  @Put('unblock/:id')
  async unblockUser(@Param('id') id: string) {
    return this.userAdminService.updateUserStatus({
      userId: id,
      status: 'ACTIVE',
      reason: 'unblock'
    });
  }
}