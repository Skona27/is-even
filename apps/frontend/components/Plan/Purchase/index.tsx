import * as React from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { useUserContext } from '@context/user-context';
import { Card } from '@components/Pricing/Card';
import { OrderApiService } from '@api/order-api/order-api.service';
import { PaymentApiService } from '@api/payment-api/payment-api.service';

enum CreaditDuration {
  Monthly = 'Monthly',
}

enum CreaditLimit {
  Free = 'Free',
  Standard = 'Standard',
}

interface CreateOrderParams {
  creditDuration: CreaditDuration;
  creditLimit: CreaditLimit;
  getAccessToken(): Promise<string>;
}

async function createOrder(params: CreateOrderParams) {
  const accessToken = await params.getAccessToken();

  const order = await OrderApiService.createOrder({
    creditDuration: params.creditDuration,
    creditLimit: params.creditLimit,
    accessToken,
  });

  const payment = await PaymentApiService.registerPayment({
    orderId: order.id,
    accessToken,
  });

  console.log(payment);
}

export function Purchase() {
  const userContext = useUserContext();

  return (
    <Stack spacing={['6']}>
      <Stack spacing="1">
        <Heading fontSize="xl">You have no active plan</Heading>
        <Text color="gray.500" maxWidth="4xl">
          Choose your plan from one od the available plans below. You can start
          with basic plan for free!
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
              action: () => {
                createOrder({
                  creditDuration: CreaditDuration.Monthly,
                  creditLimit: CreaditLimit.Free,
                  getAccessToken: userContext.getAccessToken,
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
              action: () => {
                createOrder({
                  creditDuration: CreaditDuration.Monthly,
                  creditLimit: CreaditLimit.Standard,
                  getAccessToken: userContext.getAccessToken,
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
  );
}
