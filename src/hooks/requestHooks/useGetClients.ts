'use client';

import { useQuery } from '@tanstack/react-query';

import type { BaseResponse } from '@/types/types/GlobalTypes';
import type { GetClientsResponse } from '@/types/types/ClientTypes';
import ClientApiService from '@/utils/services/ClientApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

export function useGetClients(search?: string) {
  const query = useQuery<GetClientsResponse, unknown>({
    queryKey: ['clients', search ?? ''],
    queryFn: () => ClientApiService.getClients(search),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const refetchClients = () => query.refetch();

  return { query, error, refetchClients };
}
