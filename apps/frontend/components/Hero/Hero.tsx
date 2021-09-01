import * as React from 'react';
import { Box, Heading, Container, Text, Button, Stack } from '@chakra-ui/react';

export function Hero() {
  return (
    <Container maxW="3xl">
      <Stack textAlign="center" spacing="12" py="28">
        <Heading fontWeight="bold" fontSize="6xl">
          <Text as="span" color="green.400">
            isEven API <br />
          </Text>
          tell if a number is even
        </Heading>

        <Text color="gray.500">
          Phasellus at urna nunc. Vestibulum at dui eu lorem rutrum consequat.
          Morbi vitae bibendum justo. In nec diam lectus. Cras a ornare sapien,
          vel venenatis est.
        </Text>

        <Stack spacing={4} direction="column" align="center" alignSelf="center">
          <Button
            p="6"
            colorScheme="green"
            bg="green.400"
            textTransform="uppercase"
            _hover={{
              bg: 'green.500',
            }}
          >
            View docs
          </Button>

          <Button variant="link" colorScheme="black" size="m">
            Learn more
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
