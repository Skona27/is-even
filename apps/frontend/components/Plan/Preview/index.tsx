import * as React from 'react';
import { Stack, Text, Box, Flex } from '@chakra-ui/react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export function Preview() {
  return (
    <Stack spacing="8">
      <Stack spacing="1">
        <Text color="green.500" fontWeight="900" fontSize="xl">
          Standard
        </Text>

        <Text fontWeight="500">
          Duration:{' '}
          <Text as="span" fontWeight="700">
            Monthly
          </Text>
        </Text>

        <Text fontWeight="500">
          Active until:{' '}
          <Text as="span" fontWeight="700">
            {Date.now()}
          </Text>
        </Text>

        <Text fontWeight="500">
          Usage:{' '}
          <Text as="span" fontWeight="700">
            17382 / 100000 credits
          </Text>
        </Text>
      </Stack>

      <Flex justifyContent="center">
        <Box width="60" height="60">
          <CircularProgressbar
            value={17}
            text={`${17}%`}
            styles={buildStyles({
              pathColor: 'var(--chakra-colors-green-500)',
              textColor: 'var(--chakra-colors-green-500)',
            })}
          />
        </Box>
      </Flex>
    </Stack>
  );
}
