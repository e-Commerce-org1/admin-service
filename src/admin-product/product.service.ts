import {
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
  } from '@nestjs/common';
  import { ClientGrpc } from '@nestjs/microservices';
  import { lastValueFrom } from 'rxjs';
 
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/updateproduct.dto';
  import { ProductServiceGrpc, ProductResponse ,getProductResponse,UpdateProductResponse, ProductFilter, ProductListResponse, DeleteProductResponse, UpdateInventoryRequest } from './interfaces/productinterface';
//  import { InjectLogger } from '../utils/logger/logger.decorator';
  import { Logger } from 'winston';

  
  @Injectable()
  export class ProductService {
	private productService: ProductServiceGrpc;
  
	constructor(
	  @Inject('PRODUCT_PACKAGE') private client: ClientGrpc,
	//   @InjectLogger(ProductService.name) private readonly logger: Logger
	) {}
  
	onModuleInit() {
	  this.productService = this.client.getService<ProductServiceGrpc>('ProductService');
	}
  
	async createProduct(dto: CreateProductDto): Promise<ProductResponse> {
	  try {
		const totalStock = dto.variants.reduce((sum, v) => sum + (v.stock || 0), 0); 
		const payload = { ...dto,totalStock };

		const result = await lastValueFrom(this.productService.CreateProduct(payload)) as ProductResponse;
		
		return result;
	  }
	   catch (error) {
		// this.logger.error('CreateProduct Error', { error });
		throw new InternalServerErrorException('Failed to create product');
	  }
	}
  
	async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductResponse> {
	  try {
		const totalStock = dto.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
		const payload = { id, ...dto, totalStock };
		const result = await lastValueFrom(this.productService.UpdateProduct(payload)) as UpdateProductResponse  ;
		return result;
	  } catch (error) {
		// this.logger.error('UpdateProduct Error', { error });
		throw new InternalServerErrorException('Failed to update product');
	  }
	}
  
	async getProduct(id: string): Promise<ProductResponse> {
	  try {
		const result  = await lastValueFrom(this.productService.GetProduct({ id })) as getProductResponse;
		if (!result) throw new NotFoundException('Product not found');
		return result;
	  } catch (error) {
		// this.logger.error('GetProduct Error', { error });
		throw new InternalServerErrorException('Failed to get product');
	  }
	}
  
// 	async listProducts(query: any) {
// 	  try {
// 		const result = await lastValueFrom(this.productService.ListProducts(query));
// 		return result;
// 	  } catch (error) {
// 		this.logger.error('ListProducts Error', { error });
// 		throw new InternalServerErrorException('Failed to list products');
// 	  }
// 	}
//   }
  
async listProducts(filter: ProductFilter): Promise<ProductListResponse> {
    try {
      return await lastValueFrom(this.productService.ListProducts(filter));
    } catch (error) {
    //   this.logger.error('ListProducts Error', { error });
      throw new InternalServerErrorException('Failed to list products');
    }
  }

  async deleteProduct(id: string): Promise<DeleteProductResponse> {
    try {
      return await lastValueFrom(this.productService.DeleteProduct({ id }));
    } catch (error) {
    //   this.logger.error('DeleteProduct Error', { error });
      throw new InternalServerErrorException('Failed to delete product');
    }
  }

  async updateInventory(request: UpdateInventoryRequest): Promise<ProductResponse> {
    try {
      return await lastValueFrom(this.productService.UpdateInventory(request));
    } catch (error) {
    //   this.logger.error('UpdateInventory Error', { error });
      throw new InternalServerErrorException('Failed to update inventory');
    }
  }
}