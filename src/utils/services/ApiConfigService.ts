import { BaseResponse } from '@/types/types/GlobalTypes';
import axios, { AxiosInstance } from 'axios';

export class ApiConfigService {
  public static internalApi: AxiosInstance = axios.create({
    baseURL: '/api/auth',
    withCredentials: true,
  });

  public static api: AxiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    withCredentials: true,
  });

  public static setAccessToken(api: AxiosInstance, token?: string) {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }

  public static isSuccess<T>(
    res: BaseResponse<T>
  ): res is BaseResponse<T> & { success: true; data: T } {
    return res.success === true && res.data !== null;
  }

  public static getApiErrorPayload(err: unknown): BaseResponse<null> | null {
    if (!axios.isAxiosError(err)) return null;

    const data = err.response?.data;

    if (data && typeof data === 'object' && 'success' in data) {
      return data as BaseResponse<null>;
    }

    return null;
  }

  public static getApiErrorMessage(err: unknown): string {
    const payload = ApiConfigService.getApiErrorPayload(err);
    if (payload?.message) return payload.message;
    return 'Request failed';
  }
}
