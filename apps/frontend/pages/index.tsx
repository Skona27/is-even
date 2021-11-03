import * as React from 'react';
import { Box } from '@chakra-ui/react';

import { Features } from '@components/Features';
import { Hero } from '@components/Hero';
import { Pricing } from '@components/Pricing';
import { Docs } from '@components/Docs';

export default function HomePage() {
  return (
    <Box>
      <Hero />
      <Features />
      <Pricing />
      <Docs />
    </Box>
  );
}
