export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  type: 'StockIn' | 'StockOut';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  createdAt: string;
}