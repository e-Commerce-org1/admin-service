import { Observable } from "rxjs";

export interface Variant {
  size?: string;
  color?: string;
  stock: number;
}

export interface CreateProductRequest {
  name: string;
  categoryName: string;
  brand: string;
  imageUrl: string;
  description: string;
  price: number;
  totalStock: number;
  variants: Variant[];
}

// export interface UpdateProductRequest extends Partial<CreateProductRequest> {
//   id: string;
// }
export interface UpdateProductRequest extends Partial<Omit<CreateProductRequest, 'variants'>> {
  id: string;
  variants?: Variant[];
}
export interface ProductID {
  id: string;
}

export interface ProductFilter {
  page: number;
  pageSize: number;
  categoryName?: string;
  brand?: string;
}

export interface VariantResponse extends Variant {
  id: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  categoryName: string;
  brand: string;
  imageUrl: string;
  description: string;
  price: number;
  totalStock: number;
  variants: VariantResponse[];

}

export interface UpdateInventoryRequest {
  productId: string;
  variants: Variant[];
}
export interface DeleteProductResponse {
  success: boolean;
  message: string;
}
export interface GetProductRequest extends ProductID {}
export interface ProductListRequest {
  page: number;         // current page number
  pageSize: number;     // number of items per page
  categoryName?: string; // optional filter by category
  brand?: string;       // optional filter by brand
}


export interface ProductListResponse {
  products: ProductResponse[];
  total: number;
  page: number;
  pageSize: number;
}
export interface UpdateProductResponse extends ProductResponse {}

 export interface getProductResponse extends ProductResponse {}
export interface ProductServiceGrpc {
  CreateProduct(data: CreateProductRequest): Observable<ProductResponse>;
  UpdateProduct(data: UpdateProductRequest): Observable<ProductResponse>;
  GetProduct(data: ProductID): Observable<ProductResponse>;
  ListProducts(data: ProductFilter): Observable<ProductListResponse>;
  DeleteProduct(data: ProductID): Observable<DeleteProductResponse>;
  UpdateInventory(data: UpdateInventoryRequest): Observable<ProductResponse>;
}
