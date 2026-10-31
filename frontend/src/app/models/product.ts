export interface Product {
  id: number;
  userId: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  lowStockThreshold: number;
}

export interface UpdateProductRequest {
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  lowStockThreshold: number;
}