import { Authentication } from '@common/interface/authentication.interface';
import { User } from '@common/interface/user.interface';

export interface UserContextInterface {
  user: User;
  authentication: Authentication;
  setUser(user: User): void;
  setAuthentication(authentication: Authentication): void;
}
