import * as React from 'react';
import { Heading, Stack, Flex } from '@chakra-ui/react';
import { FcAssistant, FcAlarmClock, FcGlobe } from 'react-icons/fc';

import { Container } from '../../ui/Container';
import { Feature } from './Feature';

const features = [
  {
    title: '24/7 Support',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore...',
    icon: FcAssistant,
  },
  {
    title: '99.99% SLA',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore...',
    icon: FcGlobe,
  },
  {
    title: 'Quick implementaion',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore...',
    icon: FcAlarmClock,
  },
];

export function Features() {
  return (
    <Container bg="gray.100" py={['20', '20', '24']}>
      <Stack spacing={['10', '10', '12']} alignItems="center">
        <Flex>
          <Heading
            as="h2"
            textAlign="center"
            maxWidth="xl"
            fontSize={['3xl', '4xl']}
          >
            Let our API deliver instant numerical information
          </Heading>
        </Flex>

        <Stack direction={['column', 'column', 'row']} spacing="10">
          {features.map(({ icon: IconComponent, text, title }) => (
            <Feature
              key={title}
              title={title}
              text={text}
              icon={<IconComponent size="40" />}
            />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
