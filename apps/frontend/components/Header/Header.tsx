import * as React from 'react';
import { Flex, Stack } from '@chakra-ui/react';

import { Item } from './Item';

export function Header() {
  return (
    <Flex
      as="nav"
      p="6"
      align="center"
      justify="space-between"
      bg="green.500"
      color="white"
    >
      <Stack spacing="8" align="center" justify="flex-end" direction="row">
        <Item to="/">Home</Item>
        <Item to="/pricing">Pricing</Item>
      </Stack>

      <Stack spacing="8" align="center" justify="flex-end" direction="row">
        <Item to="/login">Login</Item>
        <Item to="/signup">Sign up</Item>
      </Stack>
    </Flex>
  );
}
