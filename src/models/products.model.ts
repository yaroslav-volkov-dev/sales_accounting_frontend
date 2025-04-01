import { CategoryModel } from '@/models/category.model.ts'

export type ProductsModel = {
  id: number
  name: string
  price: number
  Category: CategoryModel
}

export type CreateProductDto = {
  name: string
  price: number
  categoryId?: number
}

export type EditProductDto = {
  name: string
  price: number
  categoryId?: number
}
