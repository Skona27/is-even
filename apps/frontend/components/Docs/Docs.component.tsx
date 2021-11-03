import { Code, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Container } from '@ui/Container';
import * as React from 'react';

export function Docs() {
  return (
    <Container py={['20', '24', '32']}>
      <Stack
        direction={['column', 'column', 'row']}
        justifyContent="space-between"
        spacing="10"
      >
        <Stack spacing={['8', '8', '10']}>
          <Stack>
            <Heading fontWeight="800" fontSize={['3xl', '3xl', '4xl']}>
              <Text as="span" color="green.400">
                isEven API{' '}
              </Text>
              Public Docs
            </Heading>

            <Text>isEven API is a RESTful API that returns json.</Text>
          </Stack>

          <Stack spacing={['4', '4', '6']}>
            <Text fontWeight="700">
              API base URL:
              <Code ml="2" fontWeight="bold">
                https://api.is-even.com/
              </Code>
            </Text>

            <Stack spacing="2">
              <Text fontWeight="700">
                Endpoint
                <Code ml="2" fontWeight="bold">
                  GET /is-even/:number
                </Code>
              </Text>

              <Text>
                Returns whether a given number is even. Allowed API usage
                depends on your plan. See Pricing above.
              </Text>
            </Stack>

            <Stack spacing="2">
              <Text fontWeight="700">URL Parameters</Text>
              <Text>
                <Code fontWeight="bold">number</Code> is the number you want to
                check
              </Text>
              <Text>
                <Code fontWeight="bold">apiKey</Code> is your API Key for
                tracking usage
              </Text>
            </Stack>
          </Stack>
        </Stack>

        <Stack spacing="3">
          <Text fontWeight="800">Example API Response</Text>
          <Code overflowX="scroll" p="3">
            <pre>
              $ curl https://api.is-even.com/is-even/6?apiKey=xyz
              <br />
              <br />
              {JSON.stringify(
                {
                  isEven: true,
                },
                null,
                2,
              )}
            </pre>
          </Code>
        </Stack>
      </Stack>
    </Container>
  );
}
