export interface StockAdjustmentRequest {
  quantity: number;
}

export interface StockAdjustmentResponse {
  message: string;
  productId: number;
  previousQuantity: number;
  addedQuantity?: number;
  removedQuantity?: number;
  newQuantity: number;
}