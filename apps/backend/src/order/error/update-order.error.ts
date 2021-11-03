export class UpdateOrderError extends Error {
  constructor(error: Error) {
    super(`Failed to update a order. ${error.message}`);
  }
}
