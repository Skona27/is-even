import * as React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useClipboard,
  Button,
} from '@chakra-ui/react';

import { format, parseISO } from 'date-fns';
import { ApiKeyApiResponseInterface } from '@api/api-key-api/interface/api-key-api-response.interface';

interface ApiKeysTable {
  apiKeys: ApiKeyApiResponseInterface[];
}

export function ApiKeysTable({ apiKeys }: ApiKeysTable) {
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
