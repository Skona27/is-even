export class InvalidPaymentStatusError extends Error {
  constructor(message: string) {
    super(`Invalid status for payment. ${message}`);
  }
}
