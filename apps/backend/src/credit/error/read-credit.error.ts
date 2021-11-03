export class ReadCreditError extends Error {
  constructor(error: Error) {
    super(`Failed to read a credit. ${error.message}`);
  }
}
