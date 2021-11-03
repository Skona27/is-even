export class ReadUserError extends Error {
  constructor(error: Error) {
    super(`Failed to read user data. ${error.message}`);
  }
}
