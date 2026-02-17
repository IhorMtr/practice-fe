'use client';

import { useMutation } from '@tanstack/react-query';

import type { InternalRefreshResponse } from '@/types/types/AuthTypes';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import AuthApiService from '@/utils/services/AuthApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

export function useRefreshToken() {
  const query = useMutation<InternalRefreshResponse, unknown, void>({
    mutationFn: () => AuthApiService.refreshToken(),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const refreshToken = () => query.mutateAsync();

  return { query, error, refreshToken };
}
