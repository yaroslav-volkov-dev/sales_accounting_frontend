export type SupplierModel = {
  name: string;
  id: number;
  phoneNumber?: string;
  _count: {
    Product: number
  };
}

export type CreateSupplierDto = Pick<SupplierModel, 'name' | 'phoneNumber'>
export type EditSupplierDto = Pick<SupplierModel, 'name' | 'phoneNumber'>