export class LoginUserError extends Error {
  constructor(error: Error) {
    super(`Failed to login user. ${error}`);
  }
}
