import * as React from 'react';
import { Stack, Heading, Text, Box, Link } from '@chakra-ui/react';

import { Container } from '@ui/Container';
import { LoginForm } from '@forms/LoginForm';
import { SocialLink } from '@ui/Link';
import { FaDev, FaGithub, FaTwitter } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <Container flex="1" direction="column" alignItems="center">
      <title>
        About the project | isEven API - SaaS platform for checking if number is
        even
      </title>

      <Stack spacing={['8', '8', '16']} alignItems="center" py="8">
        <Stack spacing={['2', '2', '4']} textAlign="center">
          <Heading fontSize={['4xl', '4xl', '6xl']}>About the project</Heading>

          <Text color="gray.500" maxWidth="4xl">
            Few words from the author
          </Text>
        </Stack>

        <Stack maxWidth="4xl" spacing="4" fontSize={['l', 'l', 'xl']}>
          <Text as="strong" fontSize={['xl', 'xl', '2xl']}>
            This is not the real SaaS platform! 😃
          </Text>

          <Text>
            Who would need the paid service for checking the parity of a number?
            😂 This project is an example of a real-world production
            application. The aim is to show how one can implement a working
            system from start to end, deploy it and monitor it. Furthermore, it
            gathers some of the best practices of project development and
            maintenance.
          </Text>

          <Text>
            Please check out the{' '}
            <Link
              textDecoration="underline"
              href="https://github.com/Skona27/is-even"
            >
              official Github repository
            </Link>{' '}
            for more information and to examine the codebase.{' '}
            <SocialLink href="https://github.com/Skona27/is-even">
              <FaGithub />
            </SocialLink>
          </Text>

          <Text>
            If you&apos;ve found this example project useful or funny, feel free
            to <strong>buy</strong> our services for one month 🙂 This will
            allow us to keep up and running for a longer time.{' '}
            <strong>AWS ain&apos;t cheap. 💰</strong>
          </Text>

          <Text>
            If you have a suggestion to make this project better, please visit
            our repository and open an issue.
          </Text>

          <Text>
            You can always contact the author via email:{' '}
            <Link textDecoration="underline" href="mailto:contact@is-even.eu">
              contact@is-even.eu
            </Link>{' '}
            , or{' '}
            <SocialLink href="https://twitter.com/SkonecznyJakub">
              <FaTwitter />
            </SocialLink>{' '}
            or even{' '}
            <SocialLink href="https://dev.to/skona27">
              <FaDev />
            </SocialLink>
          </Text>

          <Text>Cheers!</Text>
        </Stack>
      </Stack>
    </Container>
  );
}
