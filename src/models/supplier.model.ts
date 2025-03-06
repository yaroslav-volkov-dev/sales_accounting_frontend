export type SupplierModel = {
  name: string;
  id: number;
  _count: {
    Product: number
  };
}

export type CreateSupplierDto = Pick<SupplierModel, 'name'>