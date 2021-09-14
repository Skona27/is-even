import * as React from 'react';
import { Stack, Divider } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { NavigationElement } from './navigation-element.component';

const links = [
  {
    href: '/',
    text: 'Home',
  },
  {
    href: '/pricing',
    text: 'Pricing',
  },
  {
    href: '/docs',
    text: 'Docs',
  },
];

const sidebarLink = [
  {
    href: '/login',
    text: 'Login',
  },
  {
    href: '/signup',
    text: 'Sign up',
  },
];

export function Navigation() {
  const { asPath } = useRouter();

  return (
    <Stack
      as="nav"
      align="center"
      direction={['column', 'column', 'row']}
      spacing="8"
    >
      <Stack
        direction={['column', 'column', 'row']}
        spacing={['3', '3', '8']}
        align="center"
        justify="flex-end"
      >
        {links.map(({ href, text }) => (
          <NavigationElement
            key={href}
            href={href}
            text={text}
            isActive={asPath === href}
          />
        ))}
      </Stack>

      <Divider
        width="6"
        borderBottomWidth="2px"
        orientation="horizontal"
        display={['block', 'block', 'none']}
      />
      <Divider
        height="5"
        borderLeftWidth="2px"
        orientation="vertical"
        display={['none', 'none', 'block']}
      />

      <Stack
        direction={['column', 'column', 'row']}
        spacing={['3', '3', '8']}
        align="center"
        justify="flex-end"
      >
        {sidebarLink.map(({ href, text }) => (
          <NavigationElement
            key={href}
            href={href}
            text={text}
            isActive={asPath === href}
          />
        ))}
      </Stack>
    </Stack>
  );
}
