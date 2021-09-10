import * as React from 'react';
import { ChakraProvider, Flex } from '@chakra-ui/react';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Flex minHeight="100vh" direction="column">
        <Header />
        <Flex flex="1" direction="column" justifyContent="center">
          <Component {...pageProps} />
        </Flex>
        <Footer />
      </Flex>
    </ChakraProvider>
  );
}
