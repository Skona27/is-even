import * as React from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  useClipboard,
  Button,
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
import { format, parseISO } from 'date-fns';
import { ApiKeyForm } from '@forms/ApiKeyForm/api-key.form';
import { ApiKeyApiResponseInterface } from '@api/api-key-api/interface/api-key-api-response.interface';
import { ApiKeyApiService } from '@api/api-key-api/api-key-api.service';

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

        <Tabs isFitted size={['sm']} variant="enclosed">
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
              <Box py="4" overflowX="scroll">
                <OrderTable orders={orders} />
              </Box>
            </TabPanel>

            <TabPanel px="2">
              <Stack spacing={['8']} py="4">
                <Box overflowX="scroll">
                  <ApiKeysTable apiKeys={apiKeys} />
                </Box>
                <ApiKeyForm />
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}

interface OrderTableProps {
  orders: OrderApiResponseInterface[];
}

function OrderTable({ orders }: OrderTableProps) {
  return (
    <Table variant="simple" overflowX="scroll">
      <Thead>
        <Tr>
          <Th>Number</Th>
          <Th>Limit</Th>
          <Th>Duration</Th>
          <Th>Price</Th>
          <Th>Status</Th>
          <Th>Created</Th>
        </Tr>
      </Thead>
      <Tbody>
        {orders.map((order, index) => (
          <Tr key={order.id}>
            <Td>{index + 1}</Td>
            <Td>{order.creditLimit} </Td>
            <Td>{order.creditDuration}</Td>
            <Td>{order.price / 100}</Td>
            <Td>
              <Badge colorScheme="green">{order.status}</Badge>
            </Td>
            <Td>{format(parseISO(order.createdAt), 'PPP')}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

interface ApiKeysTable {
  apiKeys: ApiKeyApiResponseInterface[];
}

function ApiKeysTable({ apiKeys }: ApiKeysTable) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Number</Th>
          <Th>Name</Th>
          <Th>Last used</Th>
          <Th>Created</Th>
          <Th>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        {apiKeys.map((apiKey, index) => (
          <ApiKeyElement apiKey={apiKey} number={index + 1} key={apiKey.id} />
        ))}
      </Tbody>
    </Table>
  );
}

function ApiKeyElement({
  apiKey,
  number,
}: {
  apiKey: ApiKeyApiResponseInterface;
  number: number;
}) {
  const { hasCopied, onCopy } = useClipboard(apiKey.value);

  return (
    <Tr>
      <Td>{number}</Td>
      <Td>{apiKey.name} </Td>
      <Td>
        {apiKey.lastUsed ? format(parseISO(apiKey.lastUsed), 'PPP') : 'Never'}
      </Td>
      <Td>{format(parseISO(apiKey.createdAt), 'PPP')}</Td>
      <Td>
        <Button width="20" onClick={onCopy}>
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>
      </Td>
    </Tr>
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
