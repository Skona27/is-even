export interface LoginApiResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  auth: {
    accessToken: string;
    refreshToken: string;
    expiration: number;
  };
}
