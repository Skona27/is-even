import { NextPageContext } from 'next';
import { User } from './user.interface';

export interface GetInitialPropsWithUser {
  ctx: NextPageContext;
  user: User;
}
