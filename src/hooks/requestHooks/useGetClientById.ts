'use client';

import { useQuery } from '@tanstack/react-query';

import ClientApiService from '@/utils/services/ClientApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import type { GetClientByIdResponse } from '@/types/types/ClientTypes';

export function useGetClientById(clientId: string) {
  const query = useQuery<GetClientByIdResponse, unknown>({
    queryKey: ['client', clientId],
    queryFn: () => ClientApiService.getClientById({ clientId }),
    enabled: Boolean(clientId),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  return { query, error };
}
