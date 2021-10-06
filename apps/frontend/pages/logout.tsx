import * as React from 'react';
import { useRouter } from 'next/router';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { Container } from '@ui/Container';
import { useUserContext } from '@context/user-context';
import { makeTemporaryRedirect } from '@common/utils/make-temporary-redirect.util';
import { GetInitialPropsWithUser } from '@common/interface/get-initial-props-with-user.interface';

export default function LogoutPage() {
  const router = useRouter();
  const userContext = useUserContext();

  React.useEffect(() => {
    async function logout() {
      await userContext.logout();

      window.setTimeout(() => {
        router.push('/');
      }, 1250);
    }

    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container flex="1" direction="column" justifyContent="center">
      <Stack alignItems="center" justifyContent="center" textAlign="center">
        <Heading fontSize={['2xl', '2xl', '3xl']}>
          You have been successfully logged out
        </Heading>

        <Text color="gray.500">Redirecting to the home page</Text>
      </Stack>
    </Container>
  );
}

LogoutPage.getInitialProps = ({ ctx, user }: GetInitialPropsWithUser) => {
  if (!user) {
    makeTemporaryRedirect(ctx, '/');
  }
  return {};
};
