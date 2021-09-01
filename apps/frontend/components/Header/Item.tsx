import { Link, Text } from '@chakra-ui/react';

interface ItemProps extends React.PropsWithChildren<{}> {
  to: string;
}

export function Item({ children, to }: ItemProps) {
  return (
    <Link href={to}>
      <Text fontWeight="bold" display="block">
        {children}
      </Text>
    </Link>
  );
}
