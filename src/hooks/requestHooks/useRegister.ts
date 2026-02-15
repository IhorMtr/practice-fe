'use client';

import { useMutation } from '@tanstack/react-query';

import type { RegisterRequest } from '@/types/interfaces/AuthInterfaces';
import type { RegisterResponse } from '@/types/types/AuthTypes';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import AuthApiService from '@/utils/services/AuthApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

export function useRegister() {
  const query = useMutation<RegisterResponse, unknown, RegisterRequest>({
    mutationFn: payload => AuthApiService.register(payload),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const register = (values: RegisterRequest) => query.mutateAsync(values);

  return { query, error, register };
}
