import { ApiClientService } from '../api-client.service';
import { RegisterPaymentApiResponseInterface } from './interface/register-payment-api-response.interface';

export class PaymentApiService extends ApiClientService {
  public static async registerPayment(params: {
    orderId: string;
    accessToken: string;
  }): Promise<RegisterPaymentApiResponseInterface> {
    const { accessToken, ...body } = params;

    const result = await this.client('/payments/register', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  }
}
