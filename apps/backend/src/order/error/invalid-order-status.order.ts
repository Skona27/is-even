export class InvalidOrderStatusError extends Error {
  constructor(message: string) {
    super(`Invalid status for order. ${message}`);
  }
}
