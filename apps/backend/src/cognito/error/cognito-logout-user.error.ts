export class CognitoLogoutUserError extends Error {
  constructor(error: Error) {
    super(`Failed to logout user. ${error}`);
  }
}
