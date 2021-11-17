import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';

const data = [
  {
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Jane Cooper',
    position: 'CEO at ABC Corporation',
    title: 'Efficient Collaborating',
    content:
      ' Thank you for making the integration painless, pleasant and most of all, hassle free!',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/33.jpg',
    name: 'Brandon Park',
    position: 'Javascript Developer',
    title: 'High Product Quality',
    content:
      ' It really saves me time and effort. It is exactly what our business has been lacking. One of the best APIs ever!',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/31.jpg',
    name: 'Roy Anderson',
    position: 'Python Developer',
    title: 'Awesome features',
    content:
      ' I highly recommend this service to anyone who has struggled with checking the parity of numbers',
  },
];

const TestimonialContent = ({ children }: { children: ReactNode }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="lg"
      p={8}
      rounded="xl"
      align="center"
      pos="relative"
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {children}
    </Stack>
  );
};

const TestimonialText = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      textAlign="center"
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize="sm"
    >
      {children}
    </Text>
  );
};

const TestimonialAvatar = ({
  src,
  name,
  title,
}: {
  src: string;
  name: string;
  title: string;
}) => {
  return (
    <Flex align="center" mt={8} direction="column">
      <Avatar src={src} alt={name} mb={2} />
      <Stack spacing={-1} align="center">
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

export function Testimonials() {
  return (
    <Box bg="gray.100">
      <Container maxW="7xl" py={16} as={Stack} spacing={12}>
        <Stack spacing={2} align="center">
          <Heading>Our Clients Speak</Heading>
          <Text>We have been working with clients around the world</Text>
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 10, md: 4, lg: 10 }}
        >
          {data.map(({ title, name, image, content }) => (
            <Box flex="1" key={name}>
              <TestimonialContent>
                <Heading as="h3" fontSize="xl">
                  {title}
                </Heading>
                <TestimonialText>{content}</TestimonialText>
              </TestimonialContent>
              <TestimonialAvatar src={image} name={name} title={title} />
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
