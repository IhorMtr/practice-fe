'use client';

import { useQuery } from '@tanstack/react-query';

import type { GetUserByIdRequest } from '@/types/interfaces/UserInterfaces';
import type { GetUserByIdResponse } from '@/types/types/UserTypes';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import UserApiService from '@/utils/services/UserApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

export function useGetUserById(userId: string) {
  const query = useQuery<GetUserByIdResponse, unknown>({
    queryKey: ['users', userId],
    queryFn: () => UserApiService.getUserById({ userId } as GetUserByIdRequest),
    enabled: Boolean(userId),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const refetchUser = () => query.refetch();

  return { query, error, refetchUser };
}
