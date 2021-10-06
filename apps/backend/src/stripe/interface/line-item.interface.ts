export interface LineItem {
  quantity: number;
  price_data: {
    currency: 'eur';
    unit_amount: number;
    product_data: {
      name: string;
    };
  };
}
