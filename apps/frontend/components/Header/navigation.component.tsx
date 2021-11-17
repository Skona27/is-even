import * as React from 'react';
import {
  Stack,
  Divider,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  Button,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { NavigationElement } from './navigation-element.component';
import { User } from '@common/interface/user.interface';
import { Link } from '@ui/Link';

const links = [
  {
    href: '/#',
    text: 'Home',
  },
  {
    href: '/#pricing',
    text: 'Pricing',
  },
  {
    href: '/#docs',
    text: 'Docs',
  },
];

const sidebarLinks_loggedOut = [
  {
    href: '/login',
    text: 'Login',
  },
  {
    href: '/signup',
    text: 'Sign up',
  },
];

const sidebarLinks_loggedIn = [
  {
    href: '/account',
    text: 'Account',
  },
  {
    href: '/logout',
    text: 'Logout',
  },
];

const avatarUrl = 'https://randomuser.me/api/portraits/men/32.jpg';

interface NavigationProps {
  user?: User;
}

export function Navigation({ user }: NavigationProps) {
  const { asPath } = useRouter();
  const sidebarLinks = user ? sidebarLinks_loggedIn : sidebarLinks_loggedOut;

  return (
    <Stack
      as="nav"
      spacing="8"
      align="center"
      direction={['column', 'column', 'row']}
    >
      {user && (
        <Stack
          pb="4"
          spacing="2"
          alignItems="center"
          display={['flex', 'flex', 'none']}
        >
          <Avatar size="lg" src={avatarUrl} />

          <Text
            as="span"
            fontSize={['3xl', '3xl']}
            color="white"
            fontWeight="800"
          >
            {user.firstName} {user.lastName}
          </Text>
        </Stack>
      )}

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
        spacing={['3', '3', '8']}
        direction={['column', 'column', 'row']}
        align="center"
        justify="flex-end"
        display={['flex', 'flex', user ? 'none' : 'flex']}
      >
        {sidebarLinks.map(({ href, text }) => (
          <NavigationElement
            key={href}
            href={href}
            text={text}
            isActive={asPath === href}
          />
        ))}
      </Stack>

      {user && (
        <Stack
          spacing="2"
          direction="row"
          alignItems="center"
          display={['none', 'none', 'flex']}
        >
          <Text as="span" color="white" fontWeight="700" fontSize="lg">
            Hi, {user.firstName}!
          </Text>

          <Menu isLazy id="menu">
            <MenuButton as={Button} variant="link">
              <Avatar size="sm" src={avatarUrl} />
            </MenuButton>

            <MenuList>
              {sidebarLinks.map(({ href, text }) => (
                <MenuItem id={href} key={href}>
                  <Link href={href}>{text}</Link>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Stack>
      )}
    </Stack>
  );
}
