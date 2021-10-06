import { Box, Flex, FlexProps } from '@chakra-ui/react';
import * as React from 'react';

interface ContainerProps extends React.PropsWithChildren<{}>, FlexProps {}

export function Container({ children, ...props }: ContainerProps) {
  return (
    <Flex {...props} justifyContent="center" px="4">
      <Box width="100%" maxWidth="8xl">
        {children}
      </Box>
    </Flex>
  );
}
