export class DeleteApiKeyError extends Error {
  constructor(error: Error) {
    super(`Failed to delete an API key. ${error}`);
  }
}
