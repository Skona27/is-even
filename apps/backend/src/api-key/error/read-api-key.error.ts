export class ReadApiKeyError extends Error {
  constructor(error: Error) {
    super(`Failed to read API key. ${error}`);
  }
}
