export class CreateUserError extends Error {
  constructor(error: Error) {
    super(`Failed to create a new user. ${error}`);
  }
}
