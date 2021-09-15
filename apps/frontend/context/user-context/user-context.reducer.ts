import { UserContextInterface } from './interface/user-context.interface';
import { UserReducerActionInterface } from './interface/user-reducer-action.interface';

export function userContextReducer(
  state: Partial<UserContextInterface>,
  action: UserReducerActionInterface,
): Partial<UserContextInterface> {
  switch (action.type) {
    case 'SET_AUTHENTICATION':
      return { ...state, authentication: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}
