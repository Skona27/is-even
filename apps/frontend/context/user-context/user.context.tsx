import * as React from 'react';

import { Authentication } from '@common/interface/authentication.interface';
import { User } from '@common/interface/user.interface';

import { UserContextInterface } from './interface/user-context.interface';
import { userContextReducer } from './user-context.reducer';

interface UserContextProviderProps extends React.PropsWithChildren<{}> {}

const Context = React.createContext<Partial<UserContextInterface>>({});

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [state, dispatch] = React.useReducer(userContextReducer, {});

  function setUser(payload: User) {
    dispatch({ type: 'SET_USER', payload });
  }

  function setAuthentication(payload: Authentication) {
    dispatch({ type: 'SET_AUTHENTICATION', payload });
  }

  return (
    <Context.Provider value={{ ...state, setAuthentication, setUser }}>
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
