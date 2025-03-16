export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
}

export type SaleModel = {
  id: number
  productId: number
  Product: {
    name: string
    price: number
    id: number
  }
  sellingPrice: number
  paymentMethod: PaymentMethod
  createdAt: string
  updateAt: string
  userId: string
  storeId: number
  quantity: number
  shiftId: number
}


export type CreateSaleDto = {
  productId: number
  sellingPrice: number
  paymentMethod: PaymentMethod
  userId: string
  storeId: number
  quantity: number
  shiftId: number
}
