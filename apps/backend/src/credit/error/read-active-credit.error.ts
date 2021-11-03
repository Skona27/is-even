export class ReadActiveCreditError extends Error {
  constructor(error) {
    super(`Failed to read user's active credit. ${error.message}`);
  }
}
