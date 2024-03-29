import * as React from 'react';
import { Stack, Heading, Text, Box } from '@chakra-ui/react';
import Head from 'next/head';
import { makeTemporaryRedirect } from '@common/utils/make-temporary-redirect.util';
import { GetInitialPropsWithUser } from '@common/interface/get-initial-props-with-user.interface';

import { Container } from '@ui/Container';
import { SignupForm } from '@forms/SignupForm';

export default function SignupPage() {
  return (
    <Container flex="1" direction="column" alignItems="center" py="16">
      <Head>
        <title>
          Sign up | isEven API - SaaS platform for checking if number is even
        </title>
      </Head>

      <Stack spacing={['8', '8', '16']} alignItems="center">
        <Stack spacing={['2', '2', '4']} textAlign="center">
          <Heading fontSize={['4xl', '4xl', '6xl']}>
            Create a new account
          </Heading>

          <Text color="gray.500" maxWidth="4xl">
            You are just one step ahead from using your services
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
