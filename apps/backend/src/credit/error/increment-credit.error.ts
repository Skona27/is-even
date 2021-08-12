export class IncrementCreditError extends Error {
  constructor(error: Error) {
    super(`Failed to increment credit. ${error}`);
  }
}
