export class LogoutUserError extends Error {
  constructor(error: Error) {
    super(`Failed to logout user. ${error.message}`);
  }
}
