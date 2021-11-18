import * as React from 'react';
import { Text, Stack, Flex } from '@chakra-ui/react';

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ReactElement;
}

export function Feature({ icon, text, title }: FeatureProps) {
  return (
    <Stack alignItems="center" flex="1">
      <Flex
        align="center"
        justify="center"
        color="white"
        rounded="full"
        bg="gray.100"
      >
        {icon}
      </Flex>
      <Text fontWeight="800">{title}</Text>
      <Text textAlign="center" color="gray.600">
        {text}
      </Text>
    </Stack>
  );
}
