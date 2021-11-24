import * as React from 'react';
import { Heading, Stack, Flex } from '@chakra-ui/react';
import { FcAssistant, FcAlarmClock, FcGlobe } from 'react-icons/fc';

import { Container } from '@ui/Container';
import { Feature } from './Feature';

const features = [
  {
    title: '24/7 Support',
    text: 'We provide necessary technical assistance in case of issues with our API service. ',
    icon: FcAssistant,
  },
  {
    title: '99.99% SLA',
    text: 'Our platform has extremely high availability. We offer 99.99% uptime of our services.',
    icon: FcGlobe,
  },
  {
    title: 'Quick implementaion',
    text: 'Our API is easy to use and can be adopted gradually',
    icon: FcAlarmClock,
  },
];

export function Features() {
  return (
    <Container id="features" bg="gray.100" py={['20', '20', '24']}>
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
