import * as React from 'react';
import { Box } from '@chakra-ui/react';
import Head from 'next/head';

import { Features } from '@components/Features';
import { Hero } from '@components/Hero';
import { Pricing } from '@components/Pricing';
import { Docs } from '@components/Docs';
import { Testimonials } from '@components/Testimonials';

export default function HomePage() {
  return (
    <Box>
      <Head>
        <title>
          Home | isEven API - SaaS platform for checking if number is even
        </title>
      </Head>

      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <Docs />
    </Box>
  );
}
