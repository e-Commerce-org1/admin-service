// src/grpc/product/product-grpc.service.ts
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  ProductServiceGrpc,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductRequest,
//   DeleteProductRequest,
  ProductResponse,
  ProductListRequest,
  ProductListResponse,
} from 'src/admin-product/interfaces/productinterface';

@Injectable()
export class GrpcProductService implements OnModuleInit {
  private productService: ProductServiceGrpc;

  constructor(
    @Inject('PRODUCT_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductServiceGrpc>('ProductService');
  }

  async createProduct(payload: CreateProductRequest): Promise<ProductResponse> {
    return lastValueFrom(this.productService.CreateProduct(payload));
  }

  async updateProduct(payload: UpdateProductRequest): Promise<ProductResponse> {
    return lastValueFrom(this.productService.UpdateProduct(payload));
  }

  async getProduct(payload: GetProductRequest): Promise<ProductResponse> {
    return lastValueFrom(this.productService.GetProduct(payload));
  }

//   async deleteProduct(payload: DeleteProductRequest): Promise<ProductResponse> {
//     return lastValueFrom(this.productService.DeleteProduct(payload));
//   }

  async getProductList(payload: ProductListRequest): Promise<ProductListResponse> {
    return lastValueFrom(this.productService.ListProducts(payload));
  }
}
