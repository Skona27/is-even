export interface Authentication {
  remember: boolean;
  expiration: number;
  accessToken: string;
  refreshToken: string;
}
