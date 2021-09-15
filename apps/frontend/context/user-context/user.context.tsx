import * as React from 'react';

import { Authentication } from '@common/interface/authentication.interface';
import { User } from '@common/interface/user.interface';
import { UserApiService } from '@api/user-api/user-api.service';

import { UserContextInterface } from './interface/user-context.interface';
import { userContextReducer } from './user-context.reducer';
import { persistRefreshToken } from './utils/persist-refresh-token.util';

interface UserContextProviderProps extends React.PropsWithChildren<{}> {
  user?: User;
  authentication?: Authentication;
}

const Context = React.createContext<Partial<UserContextInterface>>({});

export function UserContextProvider({
  children,
  user,
  authentication,
}: UserContextProviderProps) {
  const [state, dispatch] = React.useReducer(userContextReducer, {
    user,
    authentication,
  });

  function setUser(payload: User) {
    dispatch({ type: 'SET_USER', payload });
  }

  function setAuthentication(payload: Authentication) {
    persistRefreshToken(payload);
    dispatch({ type: 'SET_AUTHENTICATION', payload });
  }

  async function getAccessToken() {
    const date = Date.now();

    if (!state.authentication) {
      throw new Error('User is not logged in');
    }

    if (state.authentication.expiration * 1000 > date) {
      return state.authentication.accessToken;
    }

    const { auth, user } = await UserApiService.refreshToken({
      refreshToken: state.authentication.refreshToken,
    });

    setUser(user);
    setAuthentication({ ...auth, remember: state.authentication.remember });

    return auth.accessToken;
  }

  return (
    <Context.Provider
      value={{ ...state, setAuthentication, setUser, getAccessToken }}
    >
      {children}
    </Context.Provider>
  );
}

export function useUserContext() {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error(
      'UserContext is missing. Please provide UserContextProvider',
    );
  }

  return context;
}
