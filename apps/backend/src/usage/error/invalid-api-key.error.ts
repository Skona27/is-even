export class InvalidApiKeyError extends Error {
  constructor(error) {
    super(`API Key is invalid. ${error}`);
  }
}
