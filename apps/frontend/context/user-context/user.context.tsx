import * as React from 'react';

import { Authentication } from '@common/interface/authentication.interface';
import { User } from '@common/interface/user.interface';

import { UserContextInterface } from './interface/user-context.interface';
import { userContextReducer } from './user-context.reducer';

interface UserContextProviderProps extends React.PropsWithChildren<{}> {}

const STORAGE_KEY = 'is-even_user-context';

const Context = React.createContext<Partial<UserContextInterface>>({});

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [state, dispatch] = React.useReducer(userContextReducer, {});

  function setUser(payload: User) {
    dispatch({ type: 'SET_USER', payload });
  }

  function setAuthentication(payload: Authentication) {
    dispatch({ type: 'SET_AUTHENTICATION', payload });
  }

  React.useEffect(function restore() {
    try {
      const local = window.localStorage.getItem(STORAGE_KEY);
      const session = window.sessionStorage.getItem(STORAGE_KEY);

      const state = JSON.parse(local || session);

      dispatch({ type: 'REPLACE_STATE', payload: state });
    } catch (error) {
      console.error(`Failed to reststore user context from storage`);
    }
  }, []);

  React.useEffect(
    function persist() {
      if (!state.authentication || !state.user) {
        return;
      }

      try {
        const data = JSON.stringify(state);
        const storage = state.authentication.remember
          ? window.localStorage
          : window.sessionStorage;

        storage.setItem(STORAGE_KEY, data);
      } catch (error) {
        console.error(
          `Failed to store user context in storage. ${error.message}`,
        );
      }
    },
    [state],
  );

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
