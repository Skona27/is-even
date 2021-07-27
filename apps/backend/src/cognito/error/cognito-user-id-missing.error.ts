export class CognitoUserIdMissingError extends Error {
  constructor() {
    super(`User identifier from AWS Cognito is missing`);
  }
}
