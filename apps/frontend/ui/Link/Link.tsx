import { Link as ChakraLink, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { LinkProps } from './types';

export function Link({ children, href }: LinkProps) {
  return (
    <NextLink href={href} passHref>
      <ChakraLink _hover={{ border: 'none' }}>
        <Text fontWeight="bold" display="block">
          {children}
        </Text>
      </ChakraLink>
    </NextLink>
  );
}
