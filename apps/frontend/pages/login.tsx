import * as React from 'react';
import { Stack, Heading, Text, Box } from '@chakra-ui/react';

import { makeTemporaryRedirect } from '@common/utils/make-temporary-redirect.util';
import { GetInitialPropsWithUser } from '@common/interface/get-initial-props-with-user.interface';

import { Container } from '@ui/Container';
import { LoginForm } from '@forms/LoginForm';

export default function LoginPage() {
  return (
    <Container flex="1" direction="column" alignItems="center">
      <Stack spacing={['8', '8', '16']} alignItems="center">
        <Stack spacing={['2', '2', '4']} textAlign="center">
          <Heading fontSize={['4xl', '4xl', '6xl']}>
            Sign in to your account
          </Heading>

          <Text color="gray.500" maxWidth="4xl">
            You can upgrade or track your services via your profile
          </Text>
        </Stack>

        <Box width="100%" maxWidth="md">
          <LoginForm />
        </Box>
      </Stack>
    </Container>
  );
}

LoginPage.getInitialProps = ({ ctx, user }: GetInitialPropsWithUser) => {
  if (user) {
    makeTemporaryRedirect(ctx, '/');
  }
  return {};
};
