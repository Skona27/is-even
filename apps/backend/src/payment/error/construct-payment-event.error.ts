export class ConstructPaymentEventError extends Error {
  constructor(error: Error) {
    super(`Failed to construct payment event. ${error}`);
  }
}
