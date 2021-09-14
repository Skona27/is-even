import * as React from 'react';
import { Text } from '@chakra-ui/react';

import { Link, LinkProps } from '@ui/Link';

interface NavigationElementProps extends LinkProps {
  text: string;
  isActive: boolean;
}

export function NavigationElement({
  href,
  text,
  isActive,
}: NavigationElementProps) {
  return (
    <Link href={href}>
      <Text
        as="span"
        fontSize={['2xl', '2xl', 'lg']}
        color="white"
        fontWeight="700"
        textDecoration={isActive ? 'underline' : undefined}
      >
        {text}
      </Text>
    </Link>
  );
}
