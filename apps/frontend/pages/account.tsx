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

interface AccountPageProps {
  orders: OrderApiResponseInterface[];
  activeOrder: OrderApiResponseInterface;
  activeCredit: CreditApiResponseInterface;
}

export default function AccountPage({
  orders,
  activeOrder,
  activeCredit,
}: AccountPageProps) {
  const userContext = useUserContext();

  return (
    <Container py={['12']}>
      <Stack spacing={['8']}>
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
              <Box py="4">
                <OrderTable />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}

function OrderRow() {
  return (
    <Tr>
      <Td>1</Td>
      <Td>1000 </Td>
      <Td>Monthly</Td>
      <Td>9.99</Td>
    </Tr>
  );
}

function OrderTable() {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Limit</Th>
          <Th>Duration</Th>
          <Th>Price</Th>
        </Tr>
      </Thead>
      <Tbody>
        <OrderRow />
      </Tbody>
    </Table>
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

  const [orders, credits] = await Promise.all([
    OrderApiService.getOrders({
      accessToken: authentication.accessToken,
    }),
    CreditApiService.getCredits({
      accessToken: authentication.accessToken,
    }),
  ]);

  const activeCredit = credits.find((credit) => credit.isActive);
  const activeOrder = activeCredit
    ? orders.find((order) => order.creditId === activeCredit.id)
    : undefined;

  return { orders, activeCredit, activeOrder };
};
