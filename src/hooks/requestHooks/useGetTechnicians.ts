'use client';

import { useQuery } from '@tanstack/react-query';

import UserApiService from '@/utils/services/UserApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import type { GetTechniciansResponse } from '@/types/types/UserTypes';

type Options = {
  enabled?: boolean;
};

export function useGetTechnicians(options?: Options) {
  const query = useQuery<GetTechniciansResponse, unknown>({
    queryKey: ['technicians'],
    queryFn: () => UserApiService.getTechnicians(),
    enabled: options?.enabled ?? true,
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const refetchTechnicians = () => query.refetch();

  return { query, error, refetchTechnicians };
}
