export class CreateApiKeyError extends Error {
  constructor(error: Error) {
    super(`Failed to create a new API key. ${error}`);
  }
}
