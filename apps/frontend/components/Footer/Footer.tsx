import * as React from 'react';
import { Stack, Text } from '@chakra-ui/react';
import { FaTwitter, FaGithub, FaDev } from 'react-icons/fa';

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
          <SocialLink href="https://github.com/Skona27/is-even">
            <FaGithub />
          </SocialLink>
          <SocialLink href="https://twitter.com/SkonecznyJakub">
            <FaTwitter />
          </SocialLink>
          <SocialLink href="https://dev.to/skona27">
            <FaDev />
          </SocialLink>
        </Stack>
      </Stack>
    </Container>
  );
}
