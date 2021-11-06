import getConfig from 'next/config';

export abstract class ApiClientService {
  protected static async client(
    url: RequestInfo,
    init?: RequestInit,
  ): Promise<Response> {
    const { publicRuntimeConfig } = getConfig();
    return fetch(publicRuntimeConfig.API_BASE_URL + url, init);
  }
}
