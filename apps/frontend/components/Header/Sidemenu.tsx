import * as React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Box,
} from '@chakra-ui/react';

interface SidemenuProps extends React.PropsWithChildren<{}> {
  isOpen: boolean;
  onClose(): void;
  returnFocusRef: React.RefObject<any>;
}

export function Sidemenu({
  isOpen,
  onClose,
  returnFocusRef,
  children,
}: SidemenuProps) {
  return (
    <Drawer
      isOpen={isOpen}
      size="full"
      placement="right"
      onClose={onClose}
      finalFocusRef={returnFocusRef}
    >
      <DrawerOverlay />
      <DrawerContent bg="green.400">
        <DrawerCloseButton size="lg" />
        <DrawerBody>
          <Flex height="100%" alignItems="center" justifyContent="center">
            <Box>{children}</Box>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
