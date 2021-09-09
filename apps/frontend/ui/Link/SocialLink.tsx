import { Link, useColorModeValue } from '@chakra-ui/react';
import { LinkProps } from './types';

export function SocialLink({ children, href }: LinkProps) {
  return (
    <Link
      w="8"
      h="8"
      rounded="full"
      cursor="pointer"
      href={href}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      transition="background 0.3s ease"
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      _hover={{
        bg: 'green.200',
      }}
    >
      {children}
    </Link>
  );
}
