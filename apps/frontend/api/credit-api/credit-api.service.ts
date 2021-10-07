import { ApiClientService } from '../api-client.service';
import { CreditApiResponseInterface } from './interface/credit-api-response.interface';

export class CreditApiService extends ApiClientService {
  public static async getCredits(params: {
    accessToken: string;
  }): Promise<CreditApiResponseInterface[]> {
    const { accessToken } = params;

    const result = await this.client('/credits', {
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
