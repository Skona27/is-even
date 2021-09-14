import * as React from 'react';
import { Stack, Text } from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

import { SocialLink } from '@ui/Link';
import { Container } from '@ui/Container';

export function Footer() {
  return (
    <Container bg="gray.100" py={['4', '4', '6']}>
      <Stack spacing="4" direction="row" justify="space-between" align="center">
        <Text fontWeight="600" fontSize={['sm', 'sm', 'md']}>
          © 2021 isEven API - All rights reserved
        </Text>

        <Stack direction="row" spacing={['4', '4', '6']}>
          <SocialLink href="/">
            <FaTwitter />
          </SocialLink>
          <SocialLink href="/">
            <FaYoutube />
          </SocialLink>
          <SocialLink href="/">
            <FaInstagram />
          </SocialLink>
        </Stack>
      </Stack>
    </Container>
  );
}
