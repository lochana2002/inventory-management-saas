export interface CategoryReport {
  category: string;
  productCount: number;
  totalQuantity: number;
  totalValue: number;
}

export interface InventoryReport {
  totalProducts: number;
  totalStockQuantity: number;
  totalInventoryValue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  stockByCategory: CategoryReport[];
}