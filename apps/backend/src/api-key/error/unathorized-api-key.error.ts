export class UnathorizedApiKeyError extends Error {
  constructor() {
    super(`Unathorized access to an API key.`);
  }
}
