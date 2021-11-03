import * as React from 'react';
import { format, parseISO } from 'date-fns';
import {
  Stack,
  Text,
  Flex,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { CreditApiResponseInterface } from '@api/credit-api/interface/credit-api-response.interface';

interface PreviewProps {
  planName: string;
  duration: string;
  credit: CreditApiResponseInterface;
}

export function Preview({ credit, planName, duration }: PreviewProps) {
  const usagePercentage = Math.floor((credit.usage / credit.limit) * 100);

  return (
    <Stack
      spacing="8"
      direction={['column', 'column', 'row']}
      alignItems={['flex-start', 'flex-start', 'center']}
    >
      <Stack spacing="4">
        <Text color="green.500" fontWeight="900" fontSize="4xl">
          {planName} plan
        </Text>

        <Stack spacing="1">
          <Text fontWeight="500">
            Duration:{' '}
            <Text as="span" fontSize="lg" fontWeight="700">
              {duration}
            </Text>
          </Text>
          <Text fontWeight="500">
            Active until:{' '}
            <Text as="span" fontSize="lg" fontWeight="700">
              {format(parseISO(credit.toDate), 'PPP')}
            </Text>
          </Text>
          <Text fontWeight="500">
            Usage:{' '}
            <Text as="span" fontSize="lg" fontWeight="700">
              {credit.usage} / {credit.limit} credits
            </Text>
          </Text>
        </Stack>
      </Stack>

      <Flex
        flex={1}
        alignSelf="center"
        alignItems="center"
        justifyContent={['center', 'center', 'flex-end']}
      >
        <CircularProgress
          value={usagePercentage}
          color="green.500"
          // @ts-ignore
          size={['60', 'xs', 'sm']}
        >
          <CircularProgressLabel fontSize="3xl">
            {usagePercentage}%
          </CircularProgressLabel>
        </CircularProgress>
      </Flex>
    </Stack>
  );
}
