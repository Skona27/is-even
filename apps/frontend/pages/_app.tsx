import * as React from 'react';
import { ChakraProvider, Flex } from '@chakra-ui/react';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

import { UserContextProvider } from '../context/user-context';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
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
