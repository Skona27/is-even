import { createMachine, DoneInvokeEvent, assign } from 'xstate';

import { OrderApiService } from '@api/order-api/order-api.service';
import { PaymentApiService } from '@api/payment-api/payment-api.service';
import { CreaditLimit } from '@api/order-api/interface/credit-limit.interface';
import { CreaditDuration } from '@api/order-api/interface/credit-duration.interface';
import { OrderApiResponseInterface } from '@api/order-api/interface/order-api-response.interface';
import { RegisterPaymentApiResponseInterface } from '@api/payment-api/interface/register-payment-api-response.interface';

interface Params {
  getAccessToken: () => Promise<string>;
}

interface Context {
  accessToken?: string;
  limit?: CreaditLimit;
  duration?: CreaditDuration;
  orderId?: string;
  paymentLink?: string;
}

interface Events {
  PURCHASE: {
    type: 'PURCHASE';
    data: {
      limit: CreaditLimit;
      duration: CreaditDuration;
    };
  };
}

type ValueOf<T> = T[keyof T];

export function createPurchaseMachine(params: Params) {
  return createMachine<Context, ValueOf<Events>>(
    {
      context: {},
      initial: 'idle',
      states: {
        idle: {
          on: {
            PURCHASE: {
              target: 'purchase',
              actions: 'setPurchaseData',
            },
          },
        },
        purchase: {
          initial: 'token',
          states: {
            token: {
              invoke: {
                src: 'getAccessToken',
                onDone: {
                  target: 'order',
                  actions: 'setAccessToken',
                },
                onError: {
                  target: '#error',
                },
              },
            },
            order: {
              invoke: {
                src: 'createOrder',
                onDone: [
                  {
                    target: '#done',
                    cond: 'isOrderFree',
                  },
                  {
                    target: 'payment',
                    actions: 'setOrderId',
                  },
                ],
                onError: {
                  target: '#error',
                },
              },
            },
            payment: {
              invoke: {
                src: 'registerPayment',
                onDone: {
                  target: '#redirect',
                  actions: 'setPaymentLink',
                },
                onError: {
                  target: '#error',
                },
              },
            },
          },
        },
        redirect: {
          id: 'redirect',
          type: 'final',
          entry: 'redirectToPayment',
        },
        error: {
          id: 'error',
          type: 'final',
        },
        done: {
          id: 'done',
          type: 'final',
          entry: 'reload',
        },
      },
    },
    {
      guards: {
        isOrderFree: (context: Context) => {
          return context.limit === CreaditLimit.Free;
        },
      },
      actions: {
        setAccessToken: assign<Context>({
          accessToken: (_, event: DoneInvokeEvent<string>) => event.data,
        }),
        setPurchaseData: assign<Context, Events['PURCHASE']>({
          duration: (_, event) => event.data.duration,
          limit: (_, event) => event.data.limit,
        }),
        setOrderId: assign<Context>({
          orderId: (_, event: DoneInvokeEvent<OrderApiResponseInterface>) =>
            event.data.id,
        }),
        setPaymentLink: assign<Context>({
          paymentLink: (
            _,
            event: DoneInvokeEvent<RegisterPaymentApiResponseInterface>,
          ) => event.data.url,
        }),
        redirectToPayment: (context: Context) => {
          setTimeout(() => {
            window.location.href = context.paymentLink;
          }, 1000);
        },
        reload: () => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
      } as any,
      services: {
        getAccessToken: async () => {
          return await params.getAccessToken();
        },
        createOrder: async (context: Context) => {
          return await OrderApiService.createOrder({
            creditDuration: context.duration,
            creditLimit: context.limit,
            accessToken: context.accessToken,
          });
        },
        registerPayment: async (context: Context) => {
          return await PaymentApiService.registerPayment({
            orderId: context.orderId,
            accessToken: context.accessToken,
          });
        },
      } as any,
    },
  );
}
