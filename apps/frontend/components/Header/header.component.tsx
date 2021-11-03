import * as React from 'react';
import {
  Flex,
  IconButton,
  Text,
  useDisclosure,
  Box,
  Icon,
} from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';

import { Container } from '@ui/Container';
import { useUserContext } from '@context/user-context';

import { Sidemenu } from './sidemenu.component';
import { Navigation } from './navigation.component';

export function Header() {
  const { user } = useUserContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Container bg="green.500" py={['4', '6']}>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="900" color="white" fontSize="xl">
          isEven API
        </Text>

        <IconButton
          aria-label="Menu"
          colorScheme="green"
          icon={<Icon boxSize="20px" as={FaBars} />}
          onClick={onOpen}
          display={['block', 'block', 'none']}
        />

        <Box display={['none', 'none', 'block']}>
          <Navigation user={user} />
        </Box>
      </Flex>

      <Sidemenu onClose={onClose} isOpen={isOpen} returnFocusRef={buttonRef}>
        <Navigation user={user} />
      </Sidemenu>
    </Container>
  );
}
