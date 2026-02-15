'use client';

import { useMutation } from '@tanstack/react-query';

import type { LoginRequest } from '@/types/interfaces/AuthInterfaces';
import type { LoginResponse } from '@/types/types/AuthTypes';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import AuthApiService from '@/utils/services/AuthApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

export function useLogin() {
  const query = useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: payload => AuthApiService.login(payload),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const login = (values: LoginRequest) => query.mutateAsync(values);

  return { query, error, login };
}
