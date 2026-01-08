export interface Order {
  warehouseId: number;
  orderItems: {
    productId: number;
    quantity: number;
  }[];
}
