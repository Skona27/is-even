import { Authentication } from '@common/interface/authentication.interface';
import { User } from '@common/interface/user.interface';
import { UserContextInterface } from './user-context.interface';

export type UserReducerActionInterface =
  | {
      type: 'SET_AUTHENTICATION';
      payload: Authentication;
    }
  | {
      type: 'SET_USER';
      payload: User;
    }
  | {
      type: 'REPLACE_STATE';
      payload: UserContextInterface;
    };
