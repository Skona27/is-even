import * as React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/react';

import { FieldError } from '@ui/FieldError';
import { useUserContext } from '@context/user-context';
import { promptToast } from '@components/Toast';

interface SignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export function SignupForm() {
  const router = useRouter();
  const userContext = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(data: SignupFormData) {
    try {
      setError(null);
      setIsLoading(true);

      await userContext.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      promptToast({
        status: 'success',
        title: 'Account created',
        description: 'You can now log in',
      });

      router.push('/login');
    } catch (error) {
      setError(error.message);
      setIsLoading(false);

      Sentry.withScope((scope) => {
        scope.setTag('where', 'signupForm.onSubmit');
        Sentry.captureException(error);
      });
    }
  }

  return (
    <Box rounded="lg" boxShadow="lg" bg="gray.50" p={['6', '6', '8']}>
      <Stack as="form" spacing="4" onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            bg="whiteAlpha.600"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: emailRegex,
                message: 'Email is not valid',
              },
            })}
          />
          {errors.email && (
            <FieldError message={errors.email.message} pt="2" pb="1" />
          )}
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            bg="whiteAlpha.600"
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: passwordRegex,
                message:
                  'Password must contain at least one number and one uppercase and lowercase letter, and at least 8 characters',
              },
            })}
          />
          {errors.password && (
            <FieldError message={errors.password.message} pt="2" pb="1" />
          )}
        </FormControl>

        <FormControl id="firstName">
          <FormLabel>First name</FormLabel>
          <Input
            type="text"
            bg="whiteAlpha.600"
            {...register('firstName', {
              required: 'First name is required',
            })}
          />
          {errors.firstName && (
            <FieldError message={errors.firstName.message} pt="2" pb="1" />
          )}
        </FormControl>

        <FormControl id="lastName">
          <FormLabel>Last name</FormLabel>
          <Input
            type="text"
            bg="whiteAlpha.600"
            {...register('lastName', {
              required: 'Last name is required',
            })}
          />
          {errors.lastName && (
            <FieldError message={errors.lastName.message} pt="2" pb="1" />
          )}
        </FormControl>

        <Flex pt="3">
          <Button
            flex="1"
            disabled={isLoading}
            type="submit"
            bg="green.400"
            color="white"
            _hover={{
              bg: 'green.500',
            }}
          >
            {!isLoading ? 'Sign up' : 'Please wait...'}
          </Button>
        </Flex>

        {error && <FieldError message={error} pt="1" />}
      </Stack>
    </Box>
  );
}
