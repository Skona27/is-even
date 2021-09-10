import * as React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
} from '@chakra-ui/react';

export function LoginForm() {
  return (
    <Box rounded="lg" boxShadow="lg" bg="gray.50" p={['6', '6', '8']}>
      <Stack spacing="4">
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input bg="whiteAlpha.600" type="email" />
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input bg="whiteAlpha.600" type="password" />
        </FormControl>

        <Stack spacing={['6', '6', '10']}>
          <Checkbox>Remember me</Checkbox>

          <Button
            bg="green.400"
            color="white"
            _hover={{
              bg: 'green.500',
            }}
          >
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
