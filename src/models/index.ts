export type { CreateCategoryDto, EditCategoryDto } from './category.model.ts'
export type {
  CreateProductDto, EditProductDto, ProductsModel
} from './products.model.ts'
export type { CreateSaleDto } from './sale.model.ts'
export type { CreateStoreDto, EditStoreDto } from './store.model.ts'
export type {
  CreateSupplierDto,
  EditSupplierDto
} from './supplier.model.ts'
export type { UpdateProfileDto } from './user-model.ts'

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
}

export type UserModel = {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export type CategoryModel = {
  name: string
  id: number
  _count: {
    Product: number
  }
}

export type SupplierModel = {
  name: string
  id: number
  phoneNumber: string
  _count: {
    Product: number
  }
}

export type StoreModel = {
  id: number
  name: string
  location: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

export type ProductModel = {
  id: number
  name: string
  price: number
  supplierId: number | null
  categoryId: number | null
}


export type SaleModel = {
  id: number
  sellingPrice: number
  paymentMethod: PaymentMethod
  quantity: number
  productId: number
  userId: string
  storeId: number
  shiftId: number
  createdAt: string
  updateAt: string
}

export type ShiftModel = {
  id: number
  userId: string
  storeId: number
  startedAt: string
  endedAt: string | null
}

