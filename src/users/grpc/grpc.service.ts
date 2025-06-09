import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DeleteUserRequest,
  DeleteUserResponse,
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  IUserAdminGrpcService,
  SearchUsersRequest,
  SearchUsersResponse,
  UpdateUserStatusRequest,
  UpdateUserStatusResponse,
} from './user.interface';

interface UserAdminGrpcClient {
  getAllUsers(request: GetAllUsersRequest): Observable<GetAllUsersResponse>;
  getUserById(request: GetUserByIdRequest): Observable<GetUserByIdResponse>;
  updateUserStatus(request: UpdateUserStatusRequest): Observable<UpdateUserStatusResponse>;
  deleteUser(request: DeleteUserRequest): Observable<DeleteUserResponse>;
  searchUsers(request: SearchUsersRequest): Observable<SearchUsersResponse>;
}

@Injectable()
export class UserAdminGrpcService implements OnModuleInit, IUserAdminGrpcService {
  private userAdminGrpcClient: UserAdminGrpcClient;

  constructor(@Inject('USER_ADMIN_GRPC_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userAdminGrpcClient = this.client.getService<UserAdminGrpcClient>('UserAdminGrpcService');
  }

  async getAllUsers(data: GetAllUsersRequest): Promise<GetAllUsersResponse> {
    return await lastValueFrom(this.userAdminGrpcClient.getAllUsers(data).pipe(map(response => response)));
  }

  async getUserById(data: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    return await lastValueFrom(this.userAdminGrpcClient.getUserById(data).pipe(map(response => response)));
  }

  async updateUserStatus(data: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse> {
    return await lastValueFrom(this.userAdminGrpcClient.updateUserStatus(data).pipe(map(response => response)));
  }

  async searchUsers(data: SearchUsersRequest): Promise<SearchUsersResponse> {
    return await lastValueFrom(this.userAdminGrpcClient.searchUsers(data).pipe(map(response => response)));
  }
}