export class NoActiveCreditError extends Error {
  constructor(error) {
    super(`No active credit available. ${error.message}`);
  }
}
