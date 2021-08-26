export class UnathorizedOrderError extends Error {
  constructor() {
    super(`Unathorized access to an Order.`);
  }
}
