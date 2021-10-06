import { NextPageContext } from 'next';
import { Authentication } from './authentication.interface';
import { User } from './user.interface';

export interface GetInitialPropsWithUser {
  ctx: NextPageContext;
  user: User;
  authentication: Authentication;
}
