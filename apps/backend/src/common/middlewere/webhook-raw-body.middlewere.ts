import { Response, Request } from 'express';
import { json } from 'body-parser';

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

// No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe?
export function webhookRawBodyMiddleware() {
  return json({
    verify: (
      request: RequestWithRawBody,
      _response: Response,
      buffer: Buffer,
    ) => {
      if (Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
}
