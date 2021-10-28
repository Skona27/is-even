import * as React from 'react';
import {
  Heading,
  Stack,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

import { useUserContext } from '@context/user-context';
import { Card } from '@components/Pricing/Card';
import { CreaditDuration } from '@api/order-api/interface/credit-duration.interface';
import { CreaditLimit } from '@api/order-api/interface/credit-limit.interface';
import { useMachine } from '@xstate/react';
import { createPurchaseMachine } from './purchase.machine';
import { useRouter } from 'next/router';

export function Purchase() {
  const router = useRouter();
  const userContext = useUserContext();
  const cancelRef = React.useRef();

  const [current, send] = useMachine(
    createPurchaseMachine({
      getAccessToken: userContext.getAccessToken,
    }),
  );

  if (current.matches('redirect')) {
    return (
      <Stack spacing={['6']}>
        <Heading fontSize="xl">
          You will be redirected to payment page shortly...
        </Heading>
      </Stack>
    );
  }

  if (current.matches('done')) {
    return (
      <Stack spacing={['6']}>
        <Heading fontSize="xl">Please wait...</Heading>
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={['6']}>
        <Stack spacing="1">
          <Heading fontSize="xl">You have no active plan</Heading>
          <Text color="gray.500" maxWidth="4xl">
            Choose your plan from one od the available plans below. You can
            start with basic plan for free!
          </Text>
        </Stack>

        <Stack
          direction={['column', 'column', 'column', 'row']}
          textAlign="center"
          spacing={['6', '6']}
        >
          <Card
            name="Basic"
            price="0"
            cta={{
              type: 'BUTTON',
              props: {
                name: 'Activate now for FREE',
                isDisabled: !current.matches('idle'),
                action: () => {
                  send({
                    type: 'PURCHASE',
                    data: {
                      duration: CreaditDuration.Monthly,
                      limit: CreaditLimit.Free,
                    },
                  });
                },
              },
            }}
            specification={[
              'Unlimited range',
              'Support negative numbers',
              'Limit up to 1000 API calls',
            ]}
          />

          <Card
            name="Standard"
            price="3.99"
            cta={{
              type: 'BUTTON',
              props: {
                name: 'Buy now',
                isDisabled: !current.matches('idle'),
                action: () => {
                  send({
                    type: 'PURCHASE',
                    data: {
                      duration: CreaditDuration.Monthly,
                      limit: CreaditLimit.Standard,
                    },
                  });
                },
              },
            }}
            specification={[
              'Unlimited range',
              'Support negative numbers',
              'Limit up to 100.0000 API calls',
            ]}
          />
        </Stack>
      </Stack>

      {current.matches('confirmation') && (
        <AlertDialog
          isOpen={true}
          leastDestructiveRef={cancelRef}
          onClose={() => {
            send({ type: 'CANCEL' });
          }}
        >
          <AlertDialogOverlay>
            <AlertDialogContent m={4}>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {current.context.limit} plan purchase
              </AlertDialogHeader>

              <AlertDialogBody>
                You will be redirected to payment page
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => {
                    send({ type: 'CANCEL' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  ml={3}
                  colorScheme="green"
                  onClick={() => {
                    send({ type: 'CONFIRM' });
                  }}
                >
                  Purchase
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </>
  );
}
