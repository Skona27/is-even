import * as React from 'react';
import { Stack, StackProps, Text, Box } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface FieldErrorProps extends StackProps {
  message: string;
}

export function FieldError({ message, ...props }: FieldErrorProps) {
  return (
    <Stack direction="row" alignItems="center" color="red.600" {...props}>
      <Box>
        <FaExclamationTriangle size="18px" />
      </Box>
      <Text fontWeight="600">{message}</Text>
    </Stack>
  );
}
