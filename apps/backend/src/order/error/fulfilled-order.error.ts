export class FulfilledOrderError extends Error {
  constructor() {
    super(`Order is already fulfilled.`);
  }
}
