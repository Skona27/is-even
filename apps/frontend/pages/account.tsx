import * as React from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Stack,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
} from '@chakra-ui/react';

import { Container } from '@ui/Container';
import { useUserContext } from '@context/user-context';
import { makeTemporaryRedirect } from '@common/utils/make-temporary-redirect.util';
import { GetInitialPropsWithUser } from '@common/interface/get-initial-props-with-user.interface';

import { Plan } from '@components/Plan';
import { OrderApiService } from '@api/order-api/order-api.service';
import { CreditApiService } from '@api/credit-api/credit-api.service';
import { OrderApiResponseInterface } from '@api/order-api/interface/order-api-response.interface';
import { CreditApiResponseInterface } from '@api/credit-api/interface/credit-api-response.interface';
import { ApiKeyForm } from '@forms/ApiKeyForm/api-key.form';
import { ApiKeyApiResponseInterface } from '@api/api-key-api/interface/api-key-api-response.interface';
import { ApiKeyApiService } from '@api/api-key-api/api-key-api.service';
import { OrderTable, ApiKeysTable } from '@components/Tables';

interface AccountPageProps {
  orders: OrderApiResponseInterface[];
  apiKeys: ApiKeyApiResponseInterface[];
  activeOrder: OrderApiResponseInterface;
  activeCredit: CreditApiResponseInterface;
}

export default function AccountPage({
  orders,
  apiKeys,
  activeOrder,
  activeCredit,
}: AccountPageProps) {
  const userContext = useUserContext();

  return (
    <Container py={['12']}>
      <Stack spacing={['8']}>
        {activeOrder && apiKeys.length === 0 && (
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle mr={2}>No API Key detected.</AlertTitle>
            <AlertDescription>
              Create your first API Key in order to use service.
            </AlertDescription>
          </Alert>
        )}

        <Heading>Your account</Heading>

        <Tabs isFitted size="sm" variant="enclosed">
          <TabList>
            <Tab>Active plan</Tab>
            <Tab>Orders</Tab>
            <Tab>API Keys</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px="2">
              <Box py="4">
                {!activeCredit ? (
                  <Plan.Purchase />
                ) : (
                  <Plan.Preview
                    credit={activeCredit}
                    planName={activeOrder.creditLimit}
                    duration={activeOrder.creditDuration}
                  />
                )}
              </Box>
            </TabPanel>

            <TabPanel px="2">
              <Box py="4" overflowX="auto">
                {orders.length ? (
                  <OrderTable orders={orders} />
                ) : (
                  <Text>No orders</Text>
                )}
              </Box>
            </TabPanel>

            <TabPanel px="2">
              <Stack spacing={['14']} py="4">
                {apiKeys.length > 0 && (
                  <Box overflowX="auto">
                    <ApiKeysTable apiKeys={apiKeys} />
                  </Box>
                )}
                <Stack spacing="6">
                  <Heading size="md">Create new API Key</Heading>
                  <ApiKeyForm />
                </Stack>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}

AccountPage.getInitialProps = async ({
  ctx,
  user,
  authentication,
}: GetInitialPropsWithUser) => {
  if (!user) {
    makeTemporaryRedirect(ctx, '/');
  }

  const [orders, credits, apiKeys] = await Promise.all([
    OrderApiService.getOrders({
      accessToken: authentication.accessToken,
    }),
    CreditApiService.getCredits({
      accessToken: authentication.accessToken,
    }),
    ApiKeyApiService.getApiKeys({
      accessToken: authentication.accessToken,
    }),
  ]);

  const activeCredit = credits.find((credit) => credit.isActive);
  const activeOrder = activeCredit
    ? orders.find((order) => order.creditId === activeCredit.id)
    : undefined;

  return { orders, apiKeys, activeCredit, activeOrder };
};
