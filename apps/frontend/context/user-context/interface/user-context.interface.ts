import { Authentication } from '@common/interface/authentication.interface';
import { User } from '@common/interface/user.interface';

import { LoginUserParamsInterface } from './login-user-params.interface';
import { RegisterUserParamsInterface } from './register-user-params.interface';

export interface UserContextInterface {
  user: User;
  authentication: Authentication;
  login(params: LoginUserParamsInterface): Promise<void>;
  register(params: RegisterUserParamsInterface): Promise<void>;
  logout(): Promise<void>;
  getAccessToken(): Promise<string>;
}
