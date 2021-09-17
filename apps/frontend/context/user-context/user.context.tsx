import * as React from 'react';

import { User } from '@common/interface/user.interface';
import { Authentication } from '@common/interface/authentication.interface';
import { UserApiService } from '@api/user-api/user-api.service';

import { userContextReducer } from './user-context.reducer';
import { UserContextInterface } from './interface/user-context.interface';
import { persistRefreshToken } from './utils/persist-refresh-token.util';
import { removeRefreshToken } from './utils/remove-refresh-token.util';
import { LoginUserParamsInterface } from './interface/login-user-params.interface';
import { RegisterUserParamsInterface } from './interface/register-user-params.interface';

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

    persistRefreshToken({
      accessToken: auth.accessToken,
      expiration: auth.expiration,
      refreshToken: auth.refreshToken,
      remember: state.authentication.remember,
    });

    dispatch({ type: 'SET_USER', payload: user });
    dispatch({
      type: 'SET_AUTHENTICATION',
      payload: {
        accessToken: auth.accessToken,
        expiration: auth.expiration,
        refreshToken: auth.refreshToken,
        remember: state.authentication.remember,
      },
    });

    return auth.accessToken;
  }

  async function login(params: LoginUserParamsInterface) {
    if (state.user || state.authentication) {
      throw new Error('User is already logged in');
    }

    const { user, auth } = await UserApiService.login({
      email: params.email,
      password: params.password,
    });

    persistRefreshToken({
      remember: params.remember,
      accessToken: auth.accessToken,
      expiration: auth.expiration,
      refreshToken: auth.refreshToken,
    });

    dispatch({ type: 'SET_USER', payload: user });
    dispatch({
      type: 'SET_AUTHENTICATION',
      payload: {
        remember: params.remember,
        accessToken: auth.accessToken,
        expiration: auth.expiration,
        refreshToken: auth.refreshToken,
      },
    });
  }

  async function logout() {
    if (!state.user || !state.authentication) {
      throw new Error('User is not logged in');
    }

    await UserApiService.logout({
      accessToken: state.authentication.accessToken,
    });

    removeRefreshToken();

    dispatch({ type: 'SET_USER', payload: undefined });
    dispatch({ type: 'SET_AUTHENTICATION', payload: undefined });
  }

  async function register(params: RegisterUserParamsInterface) {
    if (state.user) {
      throw new Error('User is logged in');
    }

    await UserApiService.register({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      password: params.password,
    });
  }

  return (
    <Context.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        getAccessToken,
      }}
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
