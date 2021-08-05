export class NotFoundApiKeyError extends Error {
  constructor() {
    super(`API Keys with given ID was not found.`);
  }
}
