import { Response, Request } from 'express';
import { json } from 'body-parser';

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

const webhooks = ['/payments/verify'];

export function webhookRawBodyMiddleware() {
  return json({
    verify: (
      request: RequestWithRawBody,
      _response: Response,
      buffer: Buffer,
    ) => {
      if (webhooks.includes(request.url) && Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
}
