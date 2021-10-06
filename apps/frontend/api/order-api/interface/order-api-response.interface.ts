export interface OrderApiResponseInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  creditLimit: string;
  creditDuration: string;
  price: number;
  status: string;
}
