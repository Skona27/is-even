export class CreateCreditError extends Error {
  constructor(error: Error) {
    super(`Failed to create a new credit. ${error.message}`);
  }
}
