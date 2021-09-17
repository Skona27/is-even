import { ApiClientService } from '../api-client.service';
import { LoginApiResponse } from './interface/login-api-response.interface';

export class UserApiService extends ApiClientService {
  public static async login(params: {
    email: string;
    password: string;
  }): Promise<LoginApiResponse> {
    const result = await this.client('/users/login', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    });

    const data = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  }

  public static async logout(params: { accessToken: string }): Promise<void> {
    const result = await this.client('/users/logout', {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${params.accessToken}`,
      },
    });

    if (!result.ok) {
      throw new Error('Failed to logout user');
    }
  }

  public static async refreshToken(params: {
    refreshToken: string;
  }): Promise<LoginApiResponse> {
    const result = await this.client('/users/refresh', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    });

    const data = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  }

  public static async register(params: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<any> {
    const result = await this.client('/users/register', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    });

    const data = await result.json();

    if (!result.ok) {
      throw new Error(data.message);
    }

    return data;
  }
}
