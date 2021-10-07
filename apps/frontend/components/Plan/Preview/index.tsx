import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { Stack, Text, Box, Flex } from '@chakra-ui/react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CreditApiResponseInterface } from '@api/credit-api/interface/credit-api-response.interface';

interface PreviewProps {
  planName: string;
  duration: string;
  credit: CreditApiResponseInterface;
}

export function Preview({ credit, planName, duration }: PreviewProps) {
  const usagePercentage = Math.floor((credit.usage / credit.limit) * 100);

  return (
    <Stack spacing="8">
      <Stack spacing="1">
        <Text color="green.500" fontWeight="900" fontSize="xl">
          {planName}
        </Text>

        <Text fontWeight="500">
          Duration:{' '}
          <Text as="span" fontWeight="700">
            {duration}
          </Text>
        </Text>

        <Text fontWeight="500">
          Active until:{' '}
          <Text as="span" fontWeight="700">
            {format(parseISO(credit.toDate), 'PPP')}
          </Text>
        </Text>

        <Text fontWeight="500">
          Usage:{' '}
          <Text as="span" fontWeight="700">
            {credit.usage} / {credit.limit} credits
          </Text>
        </Text>
      </Stack>

      <Flex justifyContent="center">
        <Box width="60" height="60">
          <CircularProgressbar
            value={usagePercentage}
            text={`${usagePercentage}%`}
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
