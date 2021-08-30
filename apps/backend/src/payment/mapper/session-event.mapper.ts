import Stripe from 'stripe';

import { SessionEvent } from '../interface/session-event.interface';

export function sessionEventMapper(event: Stripe.Event): SessionEvent {
  return {
    type: event.type,
    data: event.data.object,
  } as SessionEvent;
}
