'use client';

import { useMutation } from '@tanstack/react-query';

import type { LogoutResponse } from '@/types/types/AuthTypes';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import AuthApiService from '@/utils/services/AuthApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

export function useLogout() {
  const query = useMutation<LogoutResponse, unknown, void>({
    mutationFn: () => AuthApiService.logout(),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const logout = () => query.mutateAsync();

  return { query, error, logout };
}
