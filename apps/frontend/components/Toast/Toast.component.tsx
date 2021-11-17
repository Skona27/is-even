import { AlertStatus, useToast } from '@chakra-ui/react';
import * as React from 'react';
import * as Sentry from '@sentry/react';

interface ToastData {
  title: string;
  description: string;
  status: AlertStatus;
}

const TOAST_COOKIE = 'IS_EVEN_TOAST_MESSAGE';

export function Toast() {
  const toast = useToast();

  React.useEffect(() => {
    try {
      const value = window.sessionStorage.getItem(TOAST_COOKIE);

      if (!value) {
        return;
      }

      const { title, status, description } = JSON.parse(value) as ToastData;

      toast({
        title,
        description,
        status,
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
      });

      window.sessionStorage.removeItem(TOAST_COOKIE);
    } catch (error) {
      console.error(error.message);

      Sentry.withScope((scope) => {
        scope.setTag('where', 'toast.useEffect');
        Sentry.captureException(error);
      });
    }
  });

  return null;
}

export function promptToast(data: ToastData) {
  if (typeof window === undefined) {
    return;
  }

  window.sessionStorage.setItem(TOAST_COOKIE, JSON.stringify(data));
}
