'use client';

import { useQuery } from '@tanstack/react-query';

import type { GetMeResponse, GetUsersResponse } from '@/types/types/UserTypes';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import UserApiService from '@/utils/services/UserApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

export function useGetMe() {
  const query = useQuery<GetMeResponse, unknown>({
    queryKey: ['me'],
    queryFn: () => UserApiService.getMe(),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const refetchMe = () => query.refetch();

  return { query, error, refetchMe };
}
