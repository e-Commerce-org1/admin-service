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


  import { CreateProductRequest, Response,UpdateInventoryRequest,UpdateProductRequest, ProductID, ProductFilter,  } from '../../interfaces/productinterface';

  import { Logger } from 'winston';
import { ProductServiceGrpc } from '../../interfaces/productinterface';


  
  @Injectable()
  export class ProductService {
	private productService: ProductServiceGrpc;

   
  
	constructor(
	  @Inject('PRODUCT_PACKAGE') private client: ClientGrpc,
    // @Inject('AUTH_PACKAGE') private readonly clientAuth: ClientGrpc
	//   @InjectLogger(ProductService.name) private readonly logger: Logger
	) {}
  
	onModuleInit() {
	  this.productService = this.client.getService<ProductServiceGrpc>('ProductService');
	}
  

  
	async createProduct(dto: CreateProductDto): Promise<Response> {
  try {
    
    const totalStock = dto.variants.reduce((sum, variant) => sum + variant.stock, 0);

    const payload: CreateProductRequest = {
      name: dto.name,
      category: dto.category,
      subCategory: dto.subCategory || undefined,
      gender: dto.gender || undefined, 
      brand: dto.brand,
      imageUrl: dto.imageUrl,
      description: dto.description,
      price: dto.price,
      totalStock: totalStock,
      variants: dto.variants.map(variant => ({
        size: variant.size,
        color: variant.color,
        stock: variant.stock
      }))
    };
 

    const grpcResponse = await lastValueFrom(this.productService.CreateProduct(payload));
    

    if (!grpcResponse) {
      throw new InternalServerErrorException('Empty response from product service');
    }

    return grpcResponse as Response;
  } catch (error) {
  
    
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to create product');
  }
}
	async updateProduct(id: string, dto: UpdateProductDto): Promise<Response> {
	  try {
		const totalStock = dto.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
		const payload = { id, ...dto, totalStock };
		const result = await lastValueFrom(this.productService.UpdateProduct(payload)) as Response  ;
		return result;
	  } catch (error) {
		
		throw new InternalServerErrorException('Failed to update product');
	  }
	}
  
	async getProduct(id: string): Promise<Response> {
	  try {
		const result  = await lastValueFrom(this.productService.GetProduct({ id })) as Response;
		if (!result) throw new NotFoundException('Product not found');
		return result;
	  } catch (error) {
		// this.logger.error('GetProduct Error', { error });
		throw new InternalServerErrorException('Failed to get product');
	  }
	}
  

  
async listProducts(filter: ProductFilter): Promise<Response> {
    try {
      return await lastValueFrom(this.productService.ListProducts(filter));
    } catch (error) {
    //   this.logger.error('ListProducts Error', { error });
      throw new InternalServerErrorException('Failed to list products');
    }
  }

  async deleteProduct(id: string): Promise<Response> {
    try {
      return await lastValueFrom(this.productService.DeleteProduct({ id }));
    } catch (error) {
    //   this.logger.error('DeleteProduct Error', { error });
      throw new InternalServerErrorException('Failed to delete product');
    }
  }

  async updateInventory(request: UpdateInventoryRequest): Promise<Response> {
    try {
      return await lastValueFrom(this.productService.UpdateInventory(request));
    } catch (error) {
    //   this.logger.error('UpdateInventory Error', { error });
      throw new InternalServerErrorException('Failed to update inventory');
    }
  }

  
}