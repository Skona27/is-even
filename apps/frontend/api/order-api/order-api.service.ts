import { ApiClientService } from '../api-client.service';
import { OrderApiResponseInterface } from './interface/order-api-response.interface';

export class OrderApiService extends ApiClientService {
  public static async createOrder(params: {
    creditLimit: string;
    creditDuration: string;
    accessToken: string;
  }): Promise<OrderApiResponseInterface> {
    const { accessToken, ...body } = params;

    const result = await this.client('/orders', {
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

  public static async getOrders(params: {
    accessToken: string;
  }): Promise<OrderApiResponseInterface[]> {
    const { accessToken } = params;

    const result = await this.client('/orders', {
      method: 'GET',
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
