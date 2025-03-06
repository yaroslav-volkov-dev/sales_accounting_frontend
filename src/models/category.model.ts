export type CategoryModel = {
  name: string;
  id: number;
  _count: {
    Product: number
  };
}

export type CreateCategoryDto = Pick<CategoryModel, 'name'>

export type EditCategoryDto = Pick<CategoryModel, 'name'>