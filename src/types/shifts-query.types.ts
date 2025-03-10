export type ActiveShiftResponse = {
  endedAt: string | null;
  id: number;
  startedAt: string;
  storeId: number;
  userId: string;
  Store: {
    name: string;
    location: string;
  }
}