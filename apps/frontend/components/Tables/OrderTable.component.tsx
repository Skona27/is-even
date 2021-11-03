import * as React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';

import { OrderApiResponseInterface } from '@api/order-api/interface/order-api-response.interface';
import { format, parseISO } from 'date-fns';

interface OrderTableProps {
  orders: OrderApiResponseInterface[];
}

export function OrderTable({ orders }: OrderTableProps) {
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
