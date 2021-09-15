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
} from '@context/user-context';
import { UserApiService } from '@api/user-api/user-api.service';
import { User } from '@common/interface/user.interface';
import { Authentication } from '@common/interface/authentication.interface';

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

interface AppProps extends NextAppProps {
  user?: User;
  authentication?: Authentication;
}

export default function App({
  Component,
  pageProps,
  user,
  authentication,
}: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <UserContextProvider user={user} authentication={authentication}>
        <Flex minHeight="100vh" direction="column">
          <Header />
          <Flex flex="1" direction="column" justifyContent="center">
            <Component {...pageProps} />
          </Flex>
          <Footer />
        </Flex>
      </UserContextProvider>
    </ChakraProvider>
  );
}

App.getInitialProps = async function getInitialProps({ ctx }) {
  try {
    if (!ctx.req) {
      return {};
    }

    const cookies = new UniversalCookie(ctx.req.headers.cookie);
    const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE_NAME);

    if (!refreshToken) {
      return {};
    }

    const { auth, user } = await UserApiService.refreshToken({ refreshToken });

    return {
      user,
      authentication: auth,
    };
  } catch (error) {
    console.error(`Failed to fetch initial props for page. ${error.message}`);
    return {};
  }
};
