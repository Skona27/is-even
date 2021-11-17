import * as React from 'react';
import { Stack, Heading, Text } from '@chakra-ui/react';
import { Container } from '@ui/Container';
import { Card, CardProps } from './Card';

const cards: CardProps[] = [
  {
    badge: undefined,
    name: 'Basic',
    price: '0',
    cta: {
      type: 'LINK',
      props: {
        href: '/account',
        name: 'Start now',
      },
    },
    specification: [
      'Free forever',
      'Unlimited range',
      'Support negative numbers',
      'Limit up to 1000 API calls',
    ],
  },
  {
    badge: 'Recommended',
    name: 'Standard',
    price: '0.99',
    cta: {
      type: 'LINK',
      props: {
        href: '/account',
        name: 'Buy',
      },
    },
    specification: [
      'Unlimited range',
      'Support negative numbers',
      'Limit up to 100.0000 API calls',
    ],
  },
  {
    badge: undefined,
    name: 'Enterprise',
    price: '9.99',
    cta: {
      type: 'LINK',
      props: {
        href: 'mailto:skoneczny.j+iseven@gmail.com',
        name: 'Contact us',
      },
    },
    specification: [
      'Unlimited range',
      'Support negative numbers',
      'Unlimited API calls',
      '24/7 technical support',
    ],
  },
];

export function Pricing() {
  return (
    <Container id="pricing" py={['20', '32', '36']}>
      <Stack spacing={['10', '10', '20']}>
        <Stack spacing="2" textAlign="center">
          <Heading as="h1" fontSize={['3xl', '3xl', '4xl']} color="green.400">
            Plans that fit your need
          </Heading>
          <Text fontSize={['md', 'md', 'lg']} color="gray.500">
            Start now with no charges. No credit card needed. Cancel at anytime.
          </Text>
        </Stack>

        <Stack
          direction={['column', 'column', 'column', 'row']}
          textAlign="center"
          justify="center"
          spacing={['10', '10', '14']}
        >
          {cards.map(({ name, price, badge, cta, specification }) => (
            <Card
              key={name}
              name={name}
              badge={badge}
              price={price}
              cta={cta}
              specification={specification}
            />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
