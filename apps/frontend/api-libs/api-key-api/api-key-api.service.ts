import { ApiClientService } from '../api-client.service';
import { ApiKeyApiResponseInterface } from './interface/api-key-api-response.interface';

export class ApiKeyApiService extends ApiClientService {
  public static async getApiKeys(params: {
    accessToken: string;
  }): Promise<ApiKeyApiResponseInterface[]> {
    const { accessToken } = params;

    const result = await this.client('/api-keys', {
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

  public static async createApiKey(params: {
    accessToken: string;
    name: string;
  }): Promise<ApiKeyApiResponseInterface> {
    const { accessToken, ...body } = params;

    const result = await this.client('/api-keys', {
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
