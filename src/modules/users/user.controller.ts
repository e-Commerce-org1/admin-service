import { Controller, Get, HttpStatus, Param, Put, Query, UseGuards } from '@nestjs/common';
import { UserAdminGrpcService } from './grpc.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('admin/users')
export class UserController {
  constructor(
    private readonly userAdminService: UserAdminGrpcService
  ) { }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userAdminService.getUserById({ userId: id });
  }

  @Get()
  async getAllUsers(@Query('page') page: number, @Query('limit') limit: number) {
    return this.userAdminService.getAllUsers({ page: page, limit: limit });
  }

  @Get('/search')
  async searchUsers(
    @Query('query') query: string,
    @Query('status') status: 'active' | 'inactive' | 'block',
    @Query('limit') limit: number
  ) {
    return this.userAdminService.searchUsers({ query, status, limit });
  }

  @Put('block/:id')
  async blockUser(@Param('id') id: string) {
    return this.userAdminService.updateUserStatus({
      userId: id,
    });
  }

  @Put('unblock/:id')
  async unblockUser(@Param('id') id: string) {
    return this.userAdminService.unblockUser({ userId: id })
  }
}