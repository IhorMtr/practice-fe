'use client';

import { useMutation } from '@tanstack/react-query';

import TicketApiService from '@/utils/services/TicketApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import type { UpdateTicketByManagerResponse } from '@/types/types/TicketTypes';
import type { UpdateTicketByManagerRequest } from '@/types/interfaces/TicketInterfaces';

export function useUpdateTicketByManager() {
  const query = useMutation<
    UpdateTicketByManagerResponse,
    unknown,
    UpdateTicketByManagerRequest
  >({
    mutationFn: payload => TicketApiService.updateTicketByManager(payload),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const updateTicketByManager = (values: UpdateTicketByManagerRequest) =>
    query.mutateAsync(values);

  return { query, error, updateTicketByManager };
}
