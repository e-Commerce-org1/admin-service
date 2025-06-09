
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested, } from "class-validator";
import { Type } from "class-transformer";


export class CreateVariantDto {
    @IsOptional()
  @IsString()
	size?: string;


	@IsOptional()
  @IsString()
	color?: string;


	@IsNumber()
  @Min(0)
	stock: number=0;
}

export class CreateProductDto {
	
	@IsString()
	@IsNotEmpty()
	name: string;
  
	@IsString()
	@IsNotEmpty()
	categoryName: string;
  
	@IsString()
	@IsNotEmpty()
	brand: string;
  
	@IsString()
	@IsNotEmpty()
	imageUrl: string; 
  
	@IsString()
	@IsNotEmpty()
	description: string;
  
	@IsNumber()
	@Min(0)
	price: number;
  
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateVariantDto)
	variants : CreateVariantDto[];
}
