'use client';

import { useQuery } from '@tanstack/react-query';

import type { GetUsersResponse } from '@/types/types/UserTypes';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import UserApiService from '@/utils/services/UserApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

export function useGetUsers() {
  const query = useQuery<GetUsersResponse, unknown>({
    queryKey: ['users'],
    queryFn: () => UserApiService.getUsers(),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const refetchUsers = () => query.refetch();

  return { query, error, refetchUsers };
}
