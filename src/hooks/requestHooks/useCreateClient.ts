'use client';

import { useMutation } from '@tanstack/react-query';

import type { CreateClientRequest } from '@/types/interfaces/ClientInterfaces';
import type { CreateClientResponse } from '@/types/types/ClientTypes';
import type { BaseResponse } from '@/types/types/GlobalTypes';

import ClientApiService from '@/utils/services/ClientApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

export function useCreateClient() {
  const query = useMutation<CreateClientResponse, unknown, CreateClientRequest>(
    {
      mutationFn: payload => ClientApiService.createClient(payload),
    }
  );

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const createClient = (values: CreateClientRequest) =>
    query.mutateAsync(values);

  return { query, error, createClient };
}
