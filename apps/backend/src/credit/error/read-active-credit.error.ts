export class ReadActiveCreditError extends Error {
  constructor(error) {
    super(`No active credit is available. ${error}`);
  }
}
