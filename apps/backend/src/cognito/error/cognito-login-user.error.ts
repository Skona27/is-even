export class CognitoLoginUserError extends Error {
  constructor(error: Error) {
    super(`Failed to login user. ${error}`);
  }
}
