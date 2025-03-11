export type SaleModel = {
  id: number;
  productId: number;
  Product: {
    name: string;
    price: number;
    id: number
  };
  soldForPrice: number;
  paymentType: 'cash' | 'card',
  createdAt: string;
  updateAt: string;
  sellerId: number
  shopId: number;
  quantity: number;
}