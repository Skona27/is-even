import * as React from 'react';
import { Stack, Heading, Text, Box } from '@chakra-ui/react';

import { Container } from '../ui/Container';
import { LoginForm } from '../forms/LoginForm';

export default function LoginPage() {
  return (
    <Container>
      <Stack spacing={['8', '8', '16']} alignItems="center">
        <Stack spacing={['2', '2', '4']} textAlign="center">
          <Heading fontSize={['4xl', '4xl', '6xl']}>
            Sign in to your account
          </Heading>

          <Text color="gray.500" maxWidth="4xl">
            Vestibulum at dui eu lorem rutrum consequat. Morbi vitae bibendum
            justo.
          </Text>
        </Stack>

        <Box width="100%" maxWidth="md">
          <LoginForm />
        </Box>
      </Stack>
    </Container>
  );
}
