export class CreatePaymentError extends Error {
  constructor(error: Error) {
    super(`Failed to create a payment. ${error.message}`);
  }
}
