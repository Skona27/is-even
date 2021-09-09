import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </ChakraProvider>
  );
}
