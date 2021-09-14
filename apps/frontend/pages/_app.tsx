import * as React from 'react';
import { ChakraProvider, Flex, extendTheme } from '@chakra-ui/react';
import NProgress from 'nprogress';
import Router from 'next/router';

import { Header } from '@components/Header';
import { Footer } from '@components/Footer';
import { UserContextProvider } from '@context/user-context';

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

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <UserContextProvider>
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
