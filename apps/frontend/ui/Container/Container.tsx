import { Box, BoxProps, Flex } from '@chakra-ui/react';
import * as React from 'react';

interface ContainerProps extends React.PropsWithChildren<{}>, BoxProps {}

export function Container({ children, ...props }: ContainerProps) {
  return (
    <Flex {...props} justifyContent="center" px="4">
      <Box width="100%" maxWidth="8xl">
        {children}
      </Box>
    </Flex>
  );
}
