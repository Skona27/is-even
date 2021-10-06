import * as React from 'react';
import { ChakraProvider, Flex, extendTheme } from '@chakra-ui/react';
import NProgress from 'nprogress';
import Router from 'next/router';
import { AppProps as NextAppProps } from 'next/app';
import UniversalCookie from 'universal-cookie';

import { Header } from '@components/Header';
import { Footer } from '@components/Footer';
import {
  UserContextProvider,
  REFRESH_TOKEN_COOKIE_NAME,
  REMEMBER_USER_COOKIE_NAME,
} from '@context/user-context';
import { UserApiService } from '@api/user-api/user-api.service';
import { User } from '@common/interface/user.interface';
import { Authentication } from '@common/interface/authentication.interface';
import { GetInitialPropsWithUser } from '@common/interface/get-initial-props-with-user.interface';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const theme = extendTheme({
  styles: {
    global: {
      '#nprogress': {
        pointerEvents: 'none',
      },
      '#nprogress .bar': {
        backgroundColor: '#000',
        position: 'fixed',
        zIndex: 1,
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
      },
    },
  },
});

interface AppProps {
  user?: User;
  authentication?: Authentication;
  pageProps?: any;
}

export default function App({
  Component,
  pageProps,
  user,
  authentication,
}: AppProps & NextAppProps) {
  return (
    <ChakraProvider theme={theme}>
      <UserContextProvider user={user} authentication={authentication}>
        <Flex minHeight="100vh" direction="column">
          <Header />
          <Flex flex="1" direction="column">
            <Component {...pageProps} />
          </Flex>
          <Footer />
        </Flex>
      </UserContextProvider>
    </ChakraProvider>
  );
}

App.getInitialProps = async function getInitialProps({
  ctx,
  Component,
}): Promise<AppProps> {
  try {
    const cookies = ctx.req
      ? ctx.req.headers.cookie
      : typeof document !== 'undefined'
      ? document.cookie
      : '';

    const cookie = new UniversalCookie(cookies);
    const refreshToken = cookie.get(REFRESH_TOKEN_COOKIE_NAME);
    const remember = cookie.get(REMEMBER_USER_COOKIE_NAME) ? true : false;

    let user: User;
    let authentication: Authentication;

    if (refreshToken) {
      const response = await UserApiService.refreshToken({
        refreshToken,
      });

      user = response.user;
      authentication = {
        ...response.auth,
        remember,
      };
    }

    if (Component.getInitialProps) {
      const pageProps = await Component.getInitialProps({
        ctx,
        user,
        authentication,
      } as GetInitialPropsWithUser);

      return {
        pageProps,
        user,
        authentication,
      };
    }

    return {
      user,
      authentication,
    };
  } catch (error) {
    console.error(`Failed to fetch initial props for page. ${error.message}`);
    return {};
  }
};
