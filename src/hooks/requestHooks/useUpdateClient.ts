'use client';

import { useMutation } from '@tanstack/react-query';

import ClientApiService from '@/utils/services/ClientApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

import type { BaseResponse } from '@/types/types/GlobalTypes';
import type { UpdateClientRequest } from '@/types/interfaces/ClientInterfaces';
import type { UpdateClientResponse } from '@/types/types/ClientTypes';

export function useUpdateClient() {
  const query = useMutation<UpdateClientResponse, unknown, UpdateClientRequest>(
    {
      mutationFn: payload => ClientApiService.updateClient(payload),
    }
  );

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const updateClient = (values: UpdateClientRequest) =>
    query.mutateAsync(values);

  return { query, error, updateClient };
}
