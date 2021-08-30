export class DeleteOrderError extends Error {
  constructor(error: Error) {
    super(`Failed to delete the order. ${error}`);
  }
}
