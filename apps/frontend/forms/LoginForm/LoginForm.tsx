import * as React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import * as Sentry from '@sentry/react';

import { FieldError } from '@ui/FieldError';
import { useUserContext } from '@context/user-context';
import { promptToast } from '@components/Toast';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export function LoginForm() {
  const router = useRouter();
  const userContext = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(data: LoginFormData) {
    try {
      setError(null);
      setIsLoading(true);

      await userContext.login({
        email: data.email,
        password: data.password,
        remember: data.remember,
      });

      promptToast({
        status: 'success',
        title: 'Logged in',
        description: 'You have been successfully logged in.',
      });

      router.push('/account');
    } catch (error) {
      setError(error.message);
      setIsLoading(false);

      Sentry.withScope((scope) => {
        scope.setTag('where', 'loginForm.onSubmit');
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
            {...register('email', { required: 'Email is required' })}
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
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <FieldError message={errors.password.message} pt="2" pb="1" />
          )}
        </FormControl>

        <Stack spacing={['6', '6', '8']}>
          <Checkbox {...register('remember')}>Remember me</Checkbox>

          <Button
            disabled={isLoading}
            type="submit"
            bg="green.400"
            color="white"
            _hover={{
              bg: 'green.500',
            }}
          >
            {!isLoading ? 'Sign in' : 'Please wait...'}
          </Button>
        </Stack>

        {error && <FieldError message={error} pt="1" />}
      </Stack>
    </Box>
  );
}
