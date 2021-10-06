export class UpdatePaymentError extends Error {
  constructor(message: string) {
    super(`Failed to update the payment. ${message}`);
  }
}
