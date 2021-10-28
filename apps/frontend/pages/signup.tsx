import * as React from 'react';
import { Stack, Heading, Text, Box } from '@chakra-ui/react';

import { makeTemporaryRedirect } from '@common/utils/make-temporary-redirect.util';
import { GetInitialPropsWithUser } from '@common/interface/get-initial-props-with-user.interface';

import { Container } from '@ui/Container';
import { SignupForm } from '@forms/SignupForm';

export default function SignupPage() {
  return (
    <Container flex="1" direction="column" alignItems="center" py="16">
      <Stack spacing={['8', '8', '16']} alignItems="center">
        <Stack spacing={['2', '2', '4']} textAlign="center">
          <Heading fontSize={['4xl', '4xl', '6xl']}>
            Create a new account
          </Heading>

          <Text color="gray.500" maxWidth="4xl">
            Vestibulum at dui eu lorem rutrum consequat. Morbi vitae bibendum
            justo.
          </Text>
        </Stack>

        <Box width="100%" maxWidth="md">
          <SignupForm />
        </Box>
      </Stack>
    </Container>
  );
}

SignupPage.getInitialProps = ({ ctx, user }: GetInitialPropsWithUser) => {
  if (user) {
    makeTemporaryRedirect(ctx, '/');
  }
  return {};
};
