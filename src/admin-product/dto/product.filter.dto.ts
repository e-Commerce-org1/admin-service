// src/product/dto/product-filter.dto.ts
import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';

export class ProductFilterDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number=1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100) // Set a reasonable maximum page size
  pageSize: number=10;

  @IsOptional()
  @IsString()
  categoryName?: string;

  @IsOptional()
  @IsString()
  brand?: string;
}