import { CategoryModel } from '@/models/category.model.ts'
import { SupplierModel } from '@/models/supplier.model.ts'

export type ProductsModel = {
  id: number
  name: string
  price: number
  Category: CategoryModel
  Supplier: SupplierModel
}

export type CreateProductDto = {
  name: string
  price: number
  categoryId?: number
  supplierId?: number
}

export type EditProductDto = {
  name: string
  price: number
  categoryId?: number
  supplierId?: number
}
