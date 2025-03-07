export type StoreModel = {
  id: number;
  name: string;
  location: string;
  phoneNumber: string;
}

export type CreateStoreDto = {
  name: string;
  location?: string;
  phoneNumber?: string;
}

export type EditStoreDto = {
  name: string;
  location?: string;
  phoneNumber?: string;
}