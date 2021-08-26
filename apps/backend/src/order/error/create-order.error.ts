export class CreateOrderError extends Error {
  constructor(error: Error) {
    super(`Failed to create a new order. ${error}`);
  }
}
