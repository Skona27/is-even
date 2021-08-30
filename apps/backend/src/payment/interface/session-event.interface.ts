export interface SessionEvent {
  type:
    | 'checkout.session.completed'
    | 'checkout.session.async_payment_failed'
    | 'checkout.session.async_payment_succeeded';
  data: unknown;
}
