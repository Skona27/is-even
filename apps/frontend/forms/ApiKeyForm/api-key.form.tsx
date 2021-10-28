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

import { FieldError } from '@ui/FieldError';
import { useUserContext } from '@context/user-context';
import { ApiKeyApiService } from '@api/api-key-api/api-key-api.service';

interface ApiKeyFormData {
  name: string;
}

export function ApiKeyForm() {
  const router = useRouter();
  const userContext = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(data: ApiKeyFormData) {
    try {
      setError(null);
      setIsLoading(true);

      const accessToken = await userContext.getAccessToken();

      await ApiKeyApiService.createApiKey({
        accessToken,
        name: data.name,
      });

      router.push('/');
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }

  return (
    <Box rounded="lg" boxShadow="lg" bg="gray.50" p={['6', '6', '8']}>
      <Stack as="form" spacing="4" onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="name">
          <FormLabel>API Key name</FormLabel>
          <Input
            type="text"
            bg="whiteAlpha.600"
            {...register('name', { required: 'API Key name is required' })}
          />
          {errors.email && (
            <FieldError message={errors.name.message} pt="2" pb="1" />
          )}
        </FormControl>

        <Button
          disabled={isLoading}
          type="submit"
          bg="green.400"
          color="white"
          _hover={{
            bg: 'green.500',
          }}
        >
          {!isLoading ? 'Create' : 'Please wait...'}
        </Button>
      </Stack>
    </Box>
  );
}
