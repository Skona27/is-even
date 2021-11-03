export class ReadOrderError extends Error {
  constructor(error: Error) {
    super(`Failed to read a order. ${error.message}`);
  }
}
