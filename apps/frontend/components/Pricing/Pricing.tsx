import * as React from 'react';
import { Stack, Heading, Text } from '@chakra-ui/react';
import { Container } from '@ui/Container';
import { Card } from './Card';

const cards = [
  {
    badge: undefined,
    name: 'Basic',
    price: '0',
    cta: 'Start now',
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
    price: '3.99',
    cta: 'Buy',
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
    cta: 'Contact us',
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
    <Container py={['20', '32', '36']}>
      <Stack spacing={['10', '10', '20']}>
        <Stack spacing="2" textAlign="center">
          <Heading as="h1" fontSize={['3xl', '3xl', '4xl']} color="green.400">
            Plans that fit your need
          </Heading>
          <Text fontSize={['md', 'md', 'lg']} color="gray.500">
            Start with 14-day free trial. No credit card needed. Cancel at
            anytime.
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
              cta={{
                type: 'LINK',
                props: {
                  name: cta,
                  href: '/',
                },
              }}
              specification={specification}
            />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
