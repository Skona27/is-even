import * as React from 'react';
import {
  Box,
  Text,
  List,
  ListItem,
  ListIcon,
  Button,
  Stack,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

interface Button {
  type: 'BUTTON';
  props: {
    name: string;
    action(): void;
  };
}

interface Link {
  type: 'LINK';
  props: {
    name: string;
    href: string;
  };
}

export interface CardProps {
  badge?: string;
  name: string;
  price: string;
  specification: string[];
  cta: Button | Link;
}

export function Card({ name, price, badge, specification, cta }: CardProps) {
  return (
    <Box
      width={['90%', '90%', 'auto']}
      shadow="base"
      borderWidth="1px"
      alignSelf="center"
      borderColor="gray.200"
      borderRadius="xl"
    >
      <Box p={['2', '2', '4']} position="relative">
        {badge && (
          <Box
            top="-16px"
            left="50%"
            position="absolute"
            style={{ transform: 'translate(-50%)' }}
          >
            <Text
              px="3"
              py="1"
              rounded="xl"
              bg="red.400"
              color="white"
              fontSize="sm"
              fontWeight="600"
              textTransform="uppercase"
            >
              {badge}
            </Text>
          </Box>
        )}

        <Text
          fontWeight="500"
          fontSize={['xl', 'xl', '2xl']}
          py="2"
          pt={badge ? '4' : '2'}
        >
          {name}
        </Text>

        <Stack direction="row" justifyContent="center">
          <Text fontSize={['2xl', '2xl', '3xl']} fontWeight="600">
            $
          </Text>
          <Text fontSize={['3xl', '3xl', '5xl']} fontWeight="900">
            {price}
          </Text>
          <Text fontSize={['2xl', '2xl', '3xl']} color="gray.500">
            /month
          </Text>
        </Stack>
      </Box>

      <Stack
        py="4"
        spacing={['6', '6', '8']}
        bg="gray.100"
        borderBottomRadius="xl"
        alignItems="center"
      >
        <List spacing={['2', '2', '3']} textAlign="start" px={['8', '8', '10']}>
          {specification.map((element, index) => (
            <ListItem key={index}>
              <ListIcon as={FaCheckCircle} color="green.500" />
              {element}
            </ListItem>
          ))}
        </List>

        {cta.type === 'BUTTON' && (
          <Button
            w="80%"
            colorScheme="green"
            fontWeight="800"
            variant="solid"
            onClick={cta.props.action}
          >
            {cta.props.name}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
