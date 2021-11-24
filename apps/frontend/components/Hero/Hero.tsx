import * as React from 'react';
import { Heading, Text, Button, Flex, Stack } from '@chakra-ui/react';
import { Container } from '@ui/Container';

export function Hero() {
  return (
    <Container py={['20', '32', '36', '44']}>
      <Stack textAlign="center" spacing={['6', '8', '12']}>
        <Heading fontSize={['3xl', '4xl', '6xl']}>
          <Text
            as="span"
            fontWeight="900"
            color="green.400"
            fontSize={['4xl', '5xl', '6xl']}
          >
            isEven API <br />
          </Text>
          tell if a number is even
        </Heading>

        <Flex>
          <Text color="gray.500" maxWidth="4xl" margin="auto">
            Use this fantastic Software as a Service platform for checking the
            parity of a number. You don&apos;t need any advanced and heavy 3rd
            party libraries. Start now with a free tier!
          </Text>
        </Flex>

        <Stack spacing="4" direction="column" align="center" alignSelf="center">
          <Button
            as="a"
            href="/#docs"
            p={['5', '5', '6']}
            fontWeight="800"
            colorScheme="green"
            bg="green.400"
            textTransform="uppercase"
            _hover={{
              bg: 'green.500',
            }}
          >
            View docs
          </Button>

          <Button
            as="a"
            href="/#features"
            variant="link"
            fontWeight="700"
            colorScheme="black"
            size="m"
          >
            Learn more
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
