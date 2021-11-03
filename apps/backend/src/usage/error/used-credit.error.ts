export class UsedCreditError extends Error {
  constructor(error) {
    super(`Credit is fully used. ${error.message}`);
  }
}
