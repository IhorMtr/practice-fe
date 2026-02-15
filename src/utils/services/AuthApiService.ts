import type {
  LoginRequest,
  RegisterRequest,
} from '@/types/interfaces/AuthInterfaces';
import { ApiConfigService } from './ApiConfigService';
import type {
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from '@/types/types/AuthTypes';

const AuthApiService = {
  async register({
    name,
    email,
    password,
    confirmPassword,
  }: RegisterRequest): Promise<RegisterResponse> {
    const response = await ApiConfigService.api.post<RegisterResponse>(
      '/auth/register',
      { name, email, password, confirmPassword }
    );
    return response.data;
  },

  async setRefreshTokenCookie(refreshToken: string) {
    await ApiConfigService.internalApi.post('/set-cookies', { refreshToken });
  },

  async clearRefreshTokenCookie() {
    await ApiConfigService.internalApi.post('/clear-cookies');
  },

  async login({ email, password }: LoginRequest): Promise<LoginResponse> {
    const response = await ApiConfigService.api.post<LoginResponse>(
      '/auth/login',
      { email, password }
    );

    const payload = response.data;

    if (ApiConfigService.isSuccess(payload)) {
      await AuthApiService.setRefreshTokenCookie(payload.data.refreshToken);

      ApiConfigService.setAccessToken(
        ApiConfigService.api,
        payload.data.accessToken
      );
    }

    return payload;
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response =
      await ApiConfigService.internalApi.post<RefreshTokenResponse>('/refresh');

    const payload = response.data;

    if (ApiConfigService.isSuccess(payload)) {
      await AuthApiService.setRefreshTokenCookie(payload.data.refreshToken);

      ApiConfigService.setAccessToken(
        ApiConfigService.api,
        payload.data.accessToken
      );
    }

    return payload;
  },

  async logout(): Promise<LogoutResponse> {
    try {
      const response =
        await ApiConfigService.internalApi.post<LogoutResponse>('/auth/logout');

      const payload = response.data;

      if (payload.success === true) {
        ApiConfigService.setAccessToken(ApiConfigService.api, undefined);
      }

      return payload;
    } finally {
      try {
        await AuthApiService.clearRefreshTokenCookie();
      } catch {}

      ApiConfigService.setAccessToken(ApiConfigService.api, undefined);
    }
  },
};

export default AuthApiService;
