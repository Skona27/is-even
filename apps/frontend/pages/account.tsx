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

interface AccountPageProps {
  orders: unknown[];
}

export default function AccountPage({ orders }: AccountPageProps) {
  const userContext = useUserContext();

  const showPurchase = orders.length === 0;

  return (
    <Container py={['12']}>
      <Stack spacing={['8']}>
        <Heading>Your account</Heading>

        <Tabs isFitted size={['sm']} variant="enclosed">
          <TabList>
            <Tab>Active plan</Tab>
            <Tab>Orders</Tab>
            <Tab>Payments</Tab>
            <Tab>API Keys</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px="2">
              <Box py="4">
                {showPurchase ? <Plan.Purchase /> : <Plan.Preview />}
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

  const orders = await OrderApiService.getOrders({
    accessToken: authentication.accessToken,
  });

  return { orders };
};
