import { Box } from '@chakra-ui/react';

import { Features } from '../components/Features';
import { Hero } from '../components/Hero';
import { Pricing } from '../components/Pricing';

export default function Home() {
  return (
    <Box>
      <Hero />
      <Features />
      <Pricing />
    </Box>
  );
}
