import { ApiConfigService } from './ApiConfigService';
import type {
  InternalRefreshResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
} from '@/types/types/AuthTypes';
import type {
  LoginRequest,
  RegisterRequest,
} from '@/types/interfaces/AuthInterfaces';
import { useClaimsStore } from '@/state/stores/useClaimsStore';

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

      useClaimsStore.getState().setToken(payload.data.accessToken);
    } else {
      ApiConfigService.setAccessToken(ApiConfigService.api, undefined);
      useClaimsStore.getState().clear();
    }

    return payload;
  },

  async refreshToken(): Promise<InternalRefreshResponse> {
    const response =
      await ApiConfigService.internalApi.post<InternalRefreshResponse>(
        '/refresh'
      );

    const payload = response.data;

    if (ApiConfigService.isSuccess(payload)) {
      ApiConfigService.setAccessToken(
        ApiConfigService.api,
        payload.data.accessToken
      );

      useClaimsStore.getState().setToken(payload.data.accessToken);
    } else {
      ApiConfigService.setAccessToken(ApiConfigService.api, undefined);
      useClaimsStore.getState().clear();
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
        useClaimsStore.getState().clear();
      }

      return payload;
    } finally {
      try {
        await AuthApiService.clearRefreshTokenCookie();
      } catch {}

      ApiConfigService.setAccessToken(ApiConfigService.api, undefined);
      useClaimsStore.getState().clear();
    }
  },
};

export default AuthApiService;
