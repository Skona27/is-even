export class RegisterPaymentError extends Error {
  constructor(error: Error) {
    super(`Failed to register a new payment. ${error}`);
  }
}
