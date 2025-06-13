import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
  } from '@nestjs/common';
  import { ProductService } from './product.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/updateproduct.dto';
  import { Roles } from '../../rbac/decorators/roles.decorators';
  import { Permissions } from '../../rbac/decorators/permissions.decorators';
  import { RolesGuard } from '../../rbac/guards/roles.guards';
  import { PermissionsGuard } from '../../rbac/guards/permissions.guard';
  import { AdminRoles } from '../../rbac/enums/admin-roles.enum';
  import { permissions } from '../../rbac/enums/permissions';
import { ProductFilterDto } from './dto/product.filter.dto';
import { InventoryUpdateAdminDto } from './dto/inventoryupdate.dto';
 import { AuthGuard } from '../../guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
  @Controller('admin/products')
  @UseGuards(AuthGuard)
 @UseGuards(RolesGuard, PermissionsGuard)
  export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post("create")
	// @Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
	//  @Permissions(permissions.PRODUCT_CREATE)

   @UseInterceptors(FileInterceptor('image'))
	async create(@Body() dto: CreateProductDto, @UploadedFile() file: Express.Multer.File,) {
	  return await this.productService.createProduct(dto,file);
	}


    
	@Patch(':id')
	@Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
	@Permissions(permissions.PRODUCT_UPDATE)
	
  async update(
    @Param('id', ) id: string,
    @Body() dto: UpdateProductDto
  ) {
    return this.productService.updateProduct(id, dto);
  }


 
	@Get(':id')
	 @Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
  @Permissions(permissions.PRODUCT_READ)
	 async findOne(@Param('id') id: string) {
	  return await this.productService.getProduct(id);
	}



      
	@Get()
	 @Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
	 @Permissions(permissions.PRODUCT_READ)
	
	  async findAll(@Query() filter: ProductFilterDto) {
    return this.productService.listProducts(filter);
  }



    
  @Delete(':id')
  @Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
  @Permissions(permissions.PRODUCT_DELETE)
  async remove(@Param('id') id: string) {
	return await this.productService.deleteProduct(id);
  }
//   @Put(':id/inventory')
//   @Roles(AdminRoles.Super_Admin, AdminRoles.Product_Admin)
//   @Permissions(permissions.INVENTORY_UPDATE)
//   async updateInventory(
// 	@Param('id', ParseUUIDPipe) id: string,
// 	@Body() request: InventoryUpdateAdminDto
//   ) {
// 	return await this.productService.updateInventory(request);
//   }
}
  